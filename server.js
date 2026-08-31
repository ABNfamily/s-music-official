import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import multer from 'multer';
import {fileURLToPath} from 'url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express();
const PORT=process.env.PORT||3000;
const ADMIN_KEY=process.env.ADMIN_KEY||'smusic-admin';
const dbFile=path.join(__dirname,'data/site.json');
const uploadDir=path.join(__dirname,'public/uploads');
fs.mkdirSync(uploadDir,{recursive:true});
app.use(cors());app.use(express.json({limit:'3mb'}));app.use(express.urlencoded({extended:true}));app.use(express.static(path.join(__dirname,'public')));
const read=()=>JSON.parse(fs.readFileSync(dbFile,'utf8'));
const write=x=>fs.writeFileSync(dbFile,JSON.stringify(x,null,2));

const sessions=new Map();
const sessionsClean=()=>{const now=Date.now();for(const [t,v] of sessions)if(v.expires<now)sessions.delete(t)};
setInterval(sessionsClean,60_000);
function makeToken(){return crypto.randomBytes(32).toString('hex')}
function hashPin(pin){return crypto.createHash('sha256').update(pin+ADMIN_KEY).digest('hex')}
function encryptPin(pin){const key=crypto.createHash('sha256').update(ADMIN_KEY).digest();const iv=crypto.randomBytes(16);const c=crypto.createCipheriv('aes-256-cbc',key,iv);return iv.toString('hex')+':'+Buffer.concat([c.update(pin,'utf8'),c.final()]).toString('hex')}
function decryptPin(enc){const [ivHex,dataHex]=String(enc).split(':');const key=crypto.createHash('sha256').update(ADMIN_KEY).digest();const d=crypto.createDecipheriv('aes-256-cbc',key,Buffer.from(ivHex,'hex'));return Buffer.concat([d.update(Buffer.from(dataHex,'hex')),d.final()]).toString('utf8')}
function auth(req,res,next){const t=(req.headers.authorization||'').replace(/^Bearer\s+/,'');const s=sessions.get(t);if(!s||s.expires<Date.now())return res.status(401).json({error:'Admin session expired'});req.admin=true;next()}

const storage=multer.diskStorage({destination:uploadDir,filename:(req,file,cb)=>cb(null,Date.now()+'-'+file.originalname.replace(/[^a-zA-Z0-9._-]/g,'_'))});
const upload=multer({storage,limits:{fileSize:80*1024*1024}});

app.get('/api/site',(req,res)=>{const d=read();const pinRegistered=Boolean(d.admin?.pinHash);delete d.admin;res.json({...d,pinRegistered})});
app.get('/api/songs',(req,res)=>res.json(read().songs));
app.get('/api/updates',(req,res)=>res.json(read().updates));

app.post('/api/admin/register',(req,res)=>{
  const {pin}=req.body;if(!/^\d{6}$/.test(pin||''))return res.status(400).json({error:'PIN must be exactly 6 digits'});
  const d=read();if(d.admin?.pinHash)return res.status(409).json({error:'Admin PIN already registered'});
  d.admin={pinHash:hashPin(pin),pinEncrypted:encryptPin(pin),registeredAt:new Date().toISOString()};write(d);res.json({ok:true,message:'Admin PIN registered'});
});
app.post('/api/admin/login',(req,res)=>{
  const {pin}=req.body,d=read();if(!d.admin?.pinHash)return res.status(404).json({error:'PIN not registered yet'});
  if(hashPin(pin||'')!==d.admin.pinHash)return res.status(401).json({error:'Wrong PIN'});
  const token=makeToken();sessions.set(token,{expires:Date.now()+1000*60*60*12});res.json({ok:true,token,expiresIn:43200});
});
app.post('/api/admin/forgot-pin',async(req,res)=>{
  const d=read(),email=d.settings.email||'darkmusic101012@gmail.com';if(!d.admin?.pinEncrypted)return res.status(404).json({error:'No admin PIN has been registered'});
  if(!process.env.SMTP_HOST||!process.env.SMTP_USER||!process.env.SMTP_PASS)return res.status(503).json({error:'Email service is not configured on the server yet. Add SMTP_HOST, SMTP_USER and SMTP_PASS in deployment environment variables.'});
  try{
    const pin=decryptPin(d.admin.pinEncrypted);
    const transporter=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:String(process.env.SMTP_SECURE||'false')==='true',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
    await transporter.sendMail({from:process.env.SMTP_FROM||process.env.SMTP_USER,to:email,subject:'S MUSIC OFFICIAL — Admin PIN Recovery',text:`Your S MUSIC OFFICIAL admin PIN is: ${pin}\n\nIf you did not request this, secure your admin account.`});
    res.json({ok:true,message:'PIN sent to the registered admin email'});
  }catch(e){console.error(e);res.status(500).json({error:'Could not send recovery email'});}
});

app.post('/api/songs',auth,(req,res)=>{const d=read(),x={...req.body,id:req.body.id||crypto.randomUUID()};d.songs.unshift(x);write(d);res.json(x)});
app.put('/api/songs/:id',auth,(req,res)=>{const d=read(),i=d.songs.findIndex(x=>x.id===req.params.id);if(i<0)return res.status(404).json({error:'Song not found'});d.songs[i]={...d.songs[i],...req.body,id:req.params.id};write(d);res.json(d.songs[i])});
app.delete('/api/songs/:id',auth,(req,res)=>{const d=read();d.songs=d.songs.filter(x=>x.id!==req.params.id);write(d);res.json({ok:true})});
app.post('/api/updates',auth,(req,res)=>{const d=read(),x={...req.body,id:req.body.id||crypto.randomUUID()};d.updates.unshift(x);write(d);res.json(x)});
app.delete('/api/updates/:id',auth,(req,res)=>{const d=read();d.updates=d.updates.filter(x=>x.id!==req.params.id);write(d);res.json({ok:true})});
app.post('/api/settings',auth,(req,res)=>{const d=read();d.settings={...d.settings,...req.body};write(d);res.json(d.settings)});
app.post('/api/upload',auth,upload.single('file'),(req,res)=>{if(!req.file)return res.status(400).json({error:'No file'});res.json({url:'/uploads/'+req.file.filename,originalName:req.file.originalname,type:req.file.mimetype})});
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public/index.html')));
app.listen(PORT,()=>console.log(`S MUSIC OFFICIAL running on http://localhost:${PORT}`));
