/* ==========================================
   S MUSIC OFFICIAL
   MAIN WEBSITE ENGINE
========================================== */

let siteData = {

settings:{

youtubeChannel:
"https://youtube.com/@smusic-official-25",

email:
"darkmusic101012@gmail.com",

whatsapp:
"+94777990902",

websiteUrl:
"https://abnfamily.github.io/s-music-official/",

announcement:
"NEW MUSIC • NEW VIBES • S MUSIC OFFICIAL •",

aboutText:
"S MUSIC OFFICIAL is a home for original music, artists, visual stories and new sounds. Discover releases, stream music, watch official visuals and download available tracks."

},

songs:[

{
id:"bad-ah-mah",
title:"BAD'AH MAH",
artist:"AB ROCKERZ",
category:"album",
albumLabel:"1st Album",
releaseDate:"2026-05-01",
releaseTime:"00:00",
youtube:"https://youtu.be/rkR66Q2bkyY?si=laBVv5x1llHCzC8a",
mp3:"",
cover:""
},

{
id:"ullaara-vaada",
title:"ULLAARA VAADA",
artist:"AB ROCKERZ",
category:"album",
albumLabel:"3rd Album",
releaseDate:"2026-06-23",
releaseTime:"00:00",
youtube:"https://youtu.be/rxNHABZc4zU?si=ttnijvvJRlbb2D3m",
mp3:"",
cover:""
},

{
id:"marayum-ethirozhi",
title:"MARAYUM ETHIROZHI",
artist:"AB ROCKERZ",
category:"album",
albumLabel:"4th Album",
releaseDate:"2026-09-01",
releaseTime:"16:00",
youtube:"",
mp3:"",
cover:""
},

{
id:"hbd-dangera",
title:"HBD DANGERA (Party Song)",
artist:"AB ROCKERZ",
category:"film",
albumLabel:"Film Song",
releaseDate:"2026-08-14",
releaseTime:"00:00",
youtube:"https://youtu.be/kWqzfwXSKVE?si=-04bB14hrzkYE_dB",
mp3:"",
cover:""
}

],

updates:[]

};


/* ==========================================
   HELPERS
========================================== */

const $ = selector =>
document.querySelector(selector);


function safe(value){

return String(value ?? "")
.replace(/[&<>"']/g,char=>({

"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"

}[char]));

}


function releaseDateTime(song){

return new Date(
`${song.releaseDate}T${song.releaseTime || "00:00"}+05:30`
);

}


function isReleased(song){

return releaseDateTime(song).getTime()
<= Date.now();

}


function daysAgo(date){

const diff =
Math.floor(
(Date.now()-new Date(date).getTime())
/
(1000*60*60*24)
);

if(diff<=0)
return "Released today";

return `${diff} day${diff===1?"":"s"} ago`;

}


/* ==========================================
   YOUTUBE
========================================== */

function youtubeLink(url){

if(!url)
return "";

return `
<a
class="mini"
href="${safe(url)}"
target="_blank"
rel="noopener noreferrer">
YouTube ▶
</a>
`;

}


/* ==========================================
   COVER
========================================== */

function coverHTML(song){

if(song.cover){

return `
<div class="cover">

<img
src="${safe(song.cover)}"
alt="${safe(song.title)}">

<b>
${isReleased(song)?"RELEASED":"UPCOMING"}
</b>

</div>
`;

}

return `
<div class="cover">

<span>SM</span>

<b>
${isReleased(song)?"RELEASED":"UPCOMING"}
</b>

</div>
`;

}


/* ==========================================
   SONG CARD
========================================== */

function songCard(song){

const released =
isReleased(song);

const playButton =
song.mp3 && released
?
`
<button
class="mini play"
onclick="playSong('${safe(song.id)}')">
▶ Play
</button>
`
:
"";

return `

<article class="song-card">

${coverHTML(song)}

<div class="song-meta">

<div class="meta-top">

<small>
${safe(song.albumLabel || "")}
</small>

<small>

${
released
?
daysAgo(releaseDateTime(song))
:
`Releases ${new Date(song.releaseDate).toLocaleDateString("en-GB")}`
}

</small>

</div>

<h3>
${safe(song.title)}
</h3>

<p>
${safe(song.artist || "S MUSIC OFFICIAL")}
</p>

<div class="song-buttons">

${playButton}

${youtubeLink(song.youtube)}

</div>

</div>

</article>

`;

}


/* ==========================================
   RENDER SONGS
========================================== */

function renderSongs(){

const albums =
siteData.songs.filter(
song=>song.category==="album"
);

const films =
siteData.songs.filter(
song=>song.category==="film"
);

currentSongs =
[...albums,...films];

$("#albumSongs").innerHTML =
albums.length
?
albums.map(songCard).join("")
:
"<p>No album songs yet.</p>";

$("#filmSongs").innerHTML =
films.length
?
films.map(songCard).join("")
:
"<p>No film songs yet.</p>";

$("#songCount").textContent =
siteData.songs.length;

$("#albumCount").textContent =
albums.length;

}


/* ==========================================
   RECENT SWIPE
========================================== */

function renderRecent(){

const recent =
[...siteData.songs]
.sort(
(a,b)=>
new Date(b.releaseDate)-
new Date(a.releaseDate)
)
.slice(0,6);

$("#recent").innerHTML =
recent.length
?
recent.map(songCard).join("")
:
"<p>No releases yet.</p>";

}


/* ==========================================
   DOWNLOADS
========================================== */

function renderDownloads(){

const songs =
siteData.songs.filter(
song=>
song.mp3 &&
isReleased(song)
);

if(!songs.length){

$("#downloadList").innerHTML=`

<div class="download-row">

<div>

<small>
S MUSIC OFFICIAL
</small>

<strong>
MP3 downloads will appear here
</strong>

</div>

</div>

`;

return;

}

$("#downloadList").innerHTML =
songs.map(song=>`

<div class="download-row">

<div>

<small>
${safe(song.artist)}
</small>

<strong>
${safe(song.title)}
</strong>

</div>

<a
class="btn primary"
href="${safe(song.mp3)}"
download>
Download MP3 ↓
</a>

</div>

`).join("");

}


/* ==========================================
   UPDATES
========================================== */

function renderUpdates(){

if(!siteData.updates.length){

$("#updatesList").innerHTML=`

<article class="update">

<time>
S MUSIC OFFICIAL
</time>

<h3>
Welcome to S MUSIC OFFICIAL
</h3>

<p>
New releases, songs, visuals and announcements
will appear here.
</p>

</article>

`;

return;

}

$("#updatesList").innerHTML =
siteData.updates.map(update=>`

<article class="update">

<time>
${safe(update.date)}
•
${safe(update.tag || "UPDATE")}
</time>

<h3>
${safe(update.title)}
</h3>

<p>
${safe(update.body)}
</p>

</article>

`).join("");

}


/* ==========================================
   SETTINGS
========================================== */

function updateSettings(){

const s =
siteData.settings;

$("#tickerText").textContent =
s.announcement;

$("#ytChannel").href =
s.youtubeChannel;

$("#yt2").href =
s.youtubeChannel;

$("#emailLink").textContent =
s.email;

$("#emailLink").href =
`mailto:${s.email}`;

$("#waLink").textContent =
`WhatsApp: ${s.whatsapp}`;

$("#waLink").href =
`https://wa.me/${s.whatsapp.replace(/\D/g,"")}`;

$("#footerSite").href =
s.websiteUrl;

$("#aboutText").textContent =
s.aboutText;

}


/* ==========================================
   COUNTDOWN
========================================== */

function nextRelease(){

return siteData.songs
.filter(song=>!isReleased(song))
.sort(
(a,b)=>
releaseDateTime(a)-
releaseDateTime(b)
)[0] || null;

}


function updateCountdown(){

const song =
nextRelease();

if(!song){

$("#releaseTitle").textContent =
"NEW MUSIC SOON";

$("#releaseLine").textContent =
"Stay tuned for the next release.";

return;

}

const target =
releaseDateTime(song).getTime();

const difference =
target-Date.now();

$("#releaseTitle").textContent =
song.title;

if(difference<=0){

$("#releaseLine").textContent =
"RELEASED NOW • Available on S MUSIC OFFICIAL";

$("#dd").textContent="00";
$("#hh").textContent="00";
$("#mm").textContent="00";
$("#ss").textContent="00";

if(song.youtube){

$("#releaseAction").href =
song.youtube;

$("#releaseAction").textContent =
"Listen Now →";

}else{

$("#releaseAction").href =
"#music";

$("#releaseAction").textContent =
"View Song →";

}

return;

}

const seconds =
Math.floor(difference/1000);

const days =
Math.floor(seconds/86400);

const hours =
Math.floor(
(seconds%86400)/3600
);

const minutes =
Math.floor(
(seconds%3600)/60
);

const secs =
seconds%60;

$("#dd").textContent =
String(days).padStart(2,"0");

$("#hh").textContent =
String(hours).padStart(2,"0");

$("#mm").textContent =
String(minutes).padStart(2,"0");

$("#ss").textContent =
String(secs).padStart(2,"0");

$("#releaseLine").textContent =
`Releasing 01 September 2026 • 4:00 PM Sri Lanka time`;

}


/* ==========================================
   PLAYER
========================================== */

let currentSongs=[];
let currentIndex=-1;


function playSong(id){

const index =
currentSongs.findIndex(
song=>song.id===id
);

if(index===-1)
return;

currentIndex=index;

const song =
currentSongs[currentIndex];

if(!song.mp3){

if(song.youtube)
window.open(
song.youtube,
"_blank"
);

return;

}

const audio =
$("#audio");

audio.src =
song.mp3;

$("#playerTitle").textContent =
song.title;

$("#playerArtist").textContent =
song.artist;

$("#player").classList.add("show");

audio.play()
.then(()=>{
$("#playPause").textContent="❚❚";
})
.catch(()=>{
$("#playPause").textContent="▶";
});

}


function nextSong(){

if(!currentSongs.length)
return;

currentIndex =
(currentIndex+1)%currentSongs.length;

playSong(
currentSongs[currentIndex].id
);

}


function previousSong(){

if(!currentSongs.length)
return;

currentIndex =
(currentIndex-1+currentSongs.length)
%currentSongs.length;

playSong(
currentSongs[currentIndex].id
);

}


/* ==========================================
   PLAYER EVENTS
========================================== */

$("#playPause").onclick=()=>{

const audio=$("#audio");

if(!audio.src)
return;

if(audio.paused){

audio.play();

$("#playPause").textContent="❚❚";

}else{

audio.pause();

$("#playPause").textContent="▶";

}

};


$("#next").onclick=
nextSong;

$("#prev").onclick=
previousSong;


$("#closePlayer").onclick=()=>{

$("#player").classList.remove("show");

};


$("#audio").addEventListener(
"timeupdate",
()=>{

const audio=$("#audio");

if(!audio.duration)
return;

$("#progress").style.width =
`${audio.currentTime/audio.duration*100}%`;

}
);


$("#audio").addEventListener(
"ended",
nextSong
);


/* ==========================================
   MOBILE MENU
========================================== */

$("#menu").onclick=()=>{

$("#nav").classList.toggle("open");

};


/* ==========================================
   START
========================================== */

function start(){

renderSongs();

renderRecent();

renderDownloads();

renderUpdates();

updateSettings();

updateCountdown();

setInterval(
updateCountdown,
1000
);

}

start();
