const API = "./api";

let siteData = {
  settings: {
    brand: "S MUSIC",
    tagline: "OFFICIAL",
    country: "Sri Lanka",
    youtubeChannel: "https://youtube.com/@smusic-official-25",
    email: "darkmusic101012@gmail.com",
    whatsapp: "+94777990902",
    websiteUrl: "",
    announcement: "NEW MUSIC • NEW VIBES • S MUSIC OFFICIAL •"
  },
  songs: [
    {
      id: "bad-ah-mah",
      title: "BAD'AH MAH",
      artist: "AB ROCKERZ",
      category: "album",
      albumLabel: "1st Album",
      releaseDate: "2026-05-01",
      releaseTime: "00:00",
      status: "Released",
      youtube: "https://youtu.be/rkR66Q2bkyY?si=laBVv5x1llHCzC8a",
      mp3: "",
      cover: ""
    },
    {
      id: "ullaara-vaada",
      title: "ULLAARA VAADA",
      artist: "AB ROCKERZ",
      category: "album",
      albumLabel: "3rd Album",
      releaseDate: "2026-06-23",
      releaseTime: "00:00",
      status: "Released",
      youtube: "https://youtu.be/rxNHABZc4zU?si=ttnijvvJRlbb2D3m",
      mp3: "",
      cover: ""
    },
    {
      id: "marayum-ethirozhi",
      title: "MARAYUM ETHIROZHI",
      artist: "AB ROCKERZ",
      category: "album",
      albumLabel: "4th Album",
      releaseDate: "2026-09-01",
      releaseTime: "16:00",
      status: "Upcoming",
      youtube: "",
      mp3: "",
      cover: ""
    },
    {
      id: "hbd-dangera",
      title: "HBD DANGERA (Party Song)",
      artist: "AB ROCKERZ",
      category: "film",
      albumLabel: "Film Song",
      releaseDate: "2026-08-14",
      releaseTime: "00:00",
      status: "Released",
      youtube: "https://youtu.be/kWqzfwXSKVE?si=-04bB14hrzkYE_dB",
      mp3: "",
      cover: ""
    }
  ],
  updates: []
};

let currentSongs = [];
let currentIndex = -1;

const $ = (selector) => document.querySelector(selector);

function safe(value) {
  return String(value ?? "")
    .replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
}

function releaseDateTime(song) {
  return new Date(
    `${song.releaseDate}T${song.releaseTime || "00:00"}+05:30`
  );
}

function isReleased(song) {
  return releaseDateTime(song).getTime() <= Date.now();
}

function daysAgo(date) {
  const now = new Date();
  const then = new Date(date);

  const diff = Math.floor(
    (now - then) / (1000 * 60 * 60 * 24)
  );

  if (diff <= 0) return "Released today";

  return `${diff} day${diff === 1 ? "" : "s"} ago`;
}

function youtubeLink(url) {
  if (!url) return "";

  return `
    <a
      class="mini"
      href="${safe(url)}"
      target="_blank"
      rel="noopener noreferrer"
    >
      YouTube ▶
    </a>
  `;
}

function coverHTML(song) {
  if (song.cover) {
    return `
      <div class="cover">
        <img
          src="${safe(song.cover)}"
          alt="${safe(song.title)}"
        >
        <b>${isReleased(song) ? "RELEASED" : "UPCOMING"}</b>
      </div>
    `;
  }

  return `
    <div class="cover">
      <span>SM</span>
      <b>${isReleased(song) ? "RELEASED" : "UPCOMING"}</b>
    </div>
  `;
}

function songCard(song) {

  const released = isReleased(song);

  const playButton = song.mp3 && released
    ? `
      <button
        class="mini play"
        onclick="playSong('${safe(song.id)}')"
      >
        ▶ Play
      </button>
    `
    : "";

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
                ? daysAgo(releaseDateTime(song))
                : `Releases ${new Date(song.releaseDate).toLocaleDateString("en-GB")}`
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

function renderSongs() {

  const albums = siteData.songs.filter(
    song => song.category === "album"
  );

  const films = siteData.songs.filter(
    song => song.category === "film"
  );

  currentSongs = [...albums, ...films];

  $("#albumSongs").innerHTML =
    albums.length
      ? albums.map(songCard).join("")
      : `<div class="empty">No album songs yet.</div>`;

  $("#filmSongs").innerHTML =
    films.length
      ? films.map(songCard).join("")
      : `<div class="empty">No film songs yet.</div>`;

  $("#songCount").textContent =
    siteData.songs.length;

  $("#albumCount").textContent =
    albums.length;
}

function renderRecent() {

  const recent = [...siteData.songs]
    .sort(
      (a,b) =>
        new Date(b.releaseDate) -
        new Date(a.releaseDate)
    )
    .slice(0,6);

  $("#recent").innerHTML =
    recent.length
      ? recent.map(songCard).join("")
      : `<div class="empty">No releases yet.</div>`;
}

function renderDownloads() {

  const downloadable =
    siteData.songs.filter(
      song => song.mp3 && isReleased(song)
    );

  if (!downloadable.length) {

    $("#downloadList").innerHTML = `
      <div class="empty">
        MP3 downloads will appear here
        when tracks are uploaded.
      </div>
    `;

    return;
  }

  $("#downloadList").innerHTML =
    downloadable.map(song => `
      <div class="download-row">

        <div>
          <small>
            ${safe(song.artist || "S MUSIC OFFICIAL")}
          </small>

          <strong>
            ${safe(song.title)}
          </strong>
        </div>

        <a
          class="btn primary"
          href="${safe(song.mp3)}"
          download
        >
          Download MP3 ↓
        </a>

      </div>
    `).join("");
}

function renderUpdates() {

  const updates =
    siteData.updates || [];

  if (!updates.length) {

    $("#updatesList").innerHTML = `
      <div class="update">
        <time>WELCOME</time>
        <h3>Welcome to S MUSIC OFFICIAL</h3>
        <p>
          New songs, releases and music updates
          will appear here.
        </p>
      </div>
    `;

    return;
  }

  $("#updatesList").innerHTML =
    updates.map(update => `
      <article class="update">

        <time>
          ${safe(update.date || "")}
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

function updateSettings() {

  const settings = siteData.settings || {};

  $("#tickerText").textContent =
    settings.announcement ||
    "NEW MUSIC • NEW VIBES • S MUSIC OFFICIAL •";

  $("#ytChannel").href =
    settings.youtubeChannel || "#";

  $("#yt2").href =
    settings.youtubeChannel || "#";

  $("#aboutText").textContent =
    settings.aboutText ||
    "S MUSIC OFFICIAL is a home for original music, artists, visual stories and new sounds. Discover releases, stream music, watch official visuals and download available tracks.";

  $("#emailLink").textContent =
    settings.email || "";

  $("#emailLink").href =
    settings.email
      ? `mailto:${settings.email}`
      : "#";

  $("#waLink").textContent =
    settings.whatsapp
      ? `WhatsApp: ${settings.whatsapp}`
      : "";

  $("#waLink").href =
    settings.whatsapp
      ? `https://wa.me/${settings.whatsapp.replace(/\D/g,"")}`
      : "#";

  $("#footerSite").href =
    settings.websiteUrl || "#";

  if (settings.logo) {

    $("#logoBox").innerHTML =
      `<img src="${safe(settings.logo)}" alt="S MUSIC">`;

    $("#heroLogo").textContent = "";

    $("#heroLogo").innerHTML =
      `<img src="${safe(settings.logo)}" alt="S MUSIC">`;
  }
}

function findNextRelease() {

  const upcoming =
    siteData.songs
      .filter(song => !isReleased(song))
      .sort(
        (a,b) =>
          releaseDateTime(a) -
          releaseDateTime(b)
      );

  return upcoming[0] || null;
}

function updateCountdown() {

  const next = findNextRelease();

  if (!next) {

    $("#releaseTitle").textContent =
      "NEW MUSIC SOON";

    $("#releaseLine").textContent =
      "Stay tuned for the next release.";

    $("#dd").textContent = "00";
    $("#hh").textContent = "00";
    $("#mm").textContent = "00";
    $("#ss").textContent = "00";

    return;
  }

  const target =
    releaseDateTime(next).getTime();

  const now = Date.now();

  const difference =
    target - now;

  $("#releaseTitle").textContent =
    next.title;

  if (difference <= 0) {

    $("#releaseLine").textContent =
      "RELEASED NOW • Available on S MUSIC OFFICIAL";

    $("#dd").textContent = "00";
    $("#hh").textContent = "00";
    $("#mm").textContent = "00";
    $("#ss").textContent = "00";

    $("#releaseAction").textContent =
      "Listen Now →";

    if (next.youtube) {
      $("#releaseAction").href =
        next.youtube;
    } else {
      $("#releaseAction").href =
        "#music";
    }

    return;
  }

  const seconds =
    Math.floor(difference / 1000);

  const days =
    Math.floor(seconds / 86400);

  const hours =
    Math.floor((seconds % 86400) / 3600);

  const minutes =
    Math.floor((seconds % 3600) / 60);

  const secs =
    seconds % 60;

  $("#dd").textContent =
    String(days).padStart(2,"0");

  $("#hh").textContent =
    String(hours).padStart(2,"0");

  $("#mm").textContent =
    String(minutes).padStart(2,"0");

  $("#ss").textContent =
    String(secs).padStart(2,"0");

  const date =
    new Date(target);

  $("#releaseLine").textContent =
    `Releasing ${date.toLocaleDateString("en-GB",{
      day:"2-digit",
      month:"long",
      year:"numeric"
    })} • ${date.toLocaleTimeString("en-US",{
      hour:"numeric",
      minute:"2-digit"
    })} Sri Lanka time`;

  $("#releaseAction").textContent =
    "View release";

  $("#releaseAction").href =
    "#music";
}

/* MUSIC PLAYER */

function playSong(id) {

  const index =
    currentSongs.findIndex(
      song => song.id === id
    );

  if (index === -1) return;

  currentIndex = index;

  const song =
    currentSongs[currentIndex];

  if (!song.mp3) {

    if (song.youtube) {
      window.open(
        song.youtube,
        "_blank"
      );
    }

    return;
  }

  const audio =
    $("#audio");

  audio.src =
    song.mp3;

  $("#playerTitle").textContent =
    song.title;

  $("#playerArtist").textContent =
    song.artist ||
    "S MUSIC OFFICIAL";

  $("#player").classList.add("show");

  audio.play()
    .then(() => {
      $("#playPause").textContent =
        "❚❚";
    })
    .catch(() => {
      $("#playPause").textContent =
        "▶";
    });
}

function nextSong() {

  if (!currentSongs.length) return;

  currentIndex =
    (currentIndex + 1) %
    currentSongs.length;

  playSong(
    currentSongs[currentIndex].id
  );
}

function previousSong() {

  if (!currentSongs.length) return;

  currentIndex =
    (currentIndex - 1 +
      currentSongs.length) %
    currentSongs.length;

  playSong(
    currentSongs[currentIndex].id
  );
}

/* MENU */

$("#menu").addEventListener(
  "click",
  () => {
    $("#nav").classList.toggle("open");
  }
);

document
  .querySelectorAll("nav a")
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {
        $("#nav").classList.remove("open");
      }
    );

  });

/* PLAYER CONTROLS */

$("#playPause").addEventListener(
  "click",
  () => {

    const audio = $("#audio");

    if (!audio.src) return;

    if (audio.paused) {

      audio.play();

      $("#playPause").textContent =
        "❚❚";

    } else {

      audio.pause();

      $("#playPause").textContent =
        "▶";
    }

  }
);

$("#next").addEventListener(
  "click",
  nextSong
);

$("#prev").addEventListener(
  "click",
  previousSong
);

$("#closePlayer").addEventListener(
  "click",
  () => {
    $("#player").classList.remove("show");
  }
);

$("#audio").addEventListener(
  "timeupdate",
  () => {

    const audio = $("#audio");

    if (!audio.duration) return;

    const percent =
      (audio.currentTime /
        audio.duration) *
      100;

    $("#progress").style.width =
      `${percent}%`;
  }
);

$("#audio").addEventListener(
  "ended",
  nextSong
);

/* ADMIN BUTTON */

$("#adminBtn").addEventListener(
  "click",
  () => {
    window.location.href =
      "./admin.html";
  }
);

/* LOAD */

async function loadSite() {

  /*
    GitHub Pages cannot run Node API.
    Try backend first.
    If unavailable, use built-in data.
  */

  try {

    const response =
      await fetch(`${API}/site`);

    if (!response.ok) {
      throw new Error("API unavailable");
    }

    const data =
      await response.json();

    siteData =
      data;

  } catch(error) {

    console.log(
      "Using local S MUSIC data."
    );

  }

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

loadSite();
