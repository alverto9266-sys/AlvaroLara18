/* =========================================================
   MIS 18 AÑOS - ALVARO
   Lógica interactiva, Audio, Partículas y Cuenta Regresiva
   ========================================================= */

const EVENT_CONFIG = {
  nombre: "Alvaro",
  edad: 18,
  
  // FECHA Y HORA (Formato ISO: AAAA-MM-DDTHH:MM:SS-03:00)
  // Domingo 6 de Diciembre de 2026, 21:30 hs hasta 06:00 hs
  fechaInicio: new Date('2026-12-06T21:30:00-03:00'),
  fechaFin: new Date('2026-12-07T06:00:00-03:00'),
  
  // Textos para mostrar en el encabezado
  diaSemana: "DOMINGO",
  numeroDia: "06",
  mes: "DICIEMBRE 2026",
  horarioTexto: "21:30 A 06:00 HS",

  // UBICACIÓN
  nombreLugar: "Salón Plaza Norte",
  direccion: "Acceso Este Km 1003 (Lateral Norte), San Martín, Mendoza",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Salon+Plaza+Norte+Acceso+Este+Km+1003+San+Martin+Mendoza",

  // DRESS CODE
  dressCodeTitulo: "Elegante Sport",
  dressCodeDesc: "Vení con tu mejor look para bailar y disfrutar toda la noche.",
  dressCodeRestriccion: "Por favor, evitar prendas de color dorado",

  // CONFIRMACIÓN DE ASISTENCIA (RSVP)
  fechaLimiteRSVP: "2 de Diciembre",
  formRsvpUrl: "https://forms.gle/bySF1sCz3tDbuFkq6",

  // MÚSICA & SPOTIFY
  archivoAudio: "DobleP - Me Escap%C3%A9.mp3", 
  nombreTema: "DobleP - Me Escapé",
  playlistSpotifyUrl: "https://open.spotify.com/playlist/08P7EMfjTscDO9wlxp53Sa?si=PEeDyLpCTK69TVStK2CTDg&utm_source=copy-link&pi=cV4wyOmqS8CaD",

  // REGALO / TRANSFERENCIA
  aliasMP: "alvaro.mp",
  titularCuenta: "Alvaro"
};

document.addEventListener('DOMContentLoaded', () => {
  aplicarConfiguracion();
  initNeonParticles();
  initAudioAndWelcome();
  initCountdown();
  initCopyAlias();
  initCalendarButton();
  initScrollAnimations();
});

/* =========================================================
   0. APLICAR CONFIGURACIÓN AL DOM
   ========================================================= */
function aplicarConfiguracion() {
  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };

  setTxt('display-weekday', EVENT_CONFIG.diaSemana);
  setTxt('display-day', EVENT_CONFIG.numeroDia);
  setTxt('display-month', EVENT_CONFIG.mes);
  setTxt('display-time', EVENT_CONFIG.horarioTexto);

  setTxt('venue-name', EVENT_CONFIG.nombreLugar);
  setTxt('venue-address', EVENT_CONFIG.direccion);
  
  const mapBtn = document.getElementById('btn-map');
  if (mapBtn) mapBtn.href = EVENT_CONFIG.googleMapsUrl;

  setTxt('dresscode-title', EVENT_CONFIG.dressCodeTitulo);
  setTxt('dresscode-desc', EVENT_CONFIG.dressCodeDesc);

  setTxt('rsvp-deadline-date', EVENT_CONFIG.fechaLimiteRSVP);

  // Botón de Formulario RSVP (Google Forms)
  const formBtn = document.getElementById('btn-rsvp-form');
  if (formBtn) {
    formBtn.href = EVENT_CONFIG.formRsvpUrl;
  }

  // Spotify Playlist
  const spotifyBtn = document.getElementById('btn-spotify');
  if (spotifyBtn) spotifyBtn.href = EVENT_CONFIG.playlistSpotifyUrl;

  // Botón sugerir tema
  const suggestBtn = document.getElementById('btn-suggest-song');
  if (suggestBtn) {
    const suggestMsg = encodeURIComponent(`¡Hola Alvaro! Para tus 18 no puede faltar este temazo: `);
    suggestBtn.href = `https://wa.me/${EVENT_CONFIG.telefonoWhatsApp}?text=${suggestMsg}`;
  }

  // Alias
  setTxt('alias-value', EVENT_CONFIG.aliasMP);
  setTxt('alias-holder', `Titular: ${EVENT_CONFIG.titularCuenta}`);

  // Título de la pista
  setTxt('track-title-text', EVENT_CONFIG.nombreTema);

  // Elemento de audio
  const audioEl = document.getElementById('bg-audio');
  if (audioEl && EVENT_CONFIG.archivoAudio) {
    // Si tiene un source preexistente, actualizamos la fuente prioritaria
    const firstSource = audioEl.querySelector('source');
    if (firstSource) {
      firstSource.src = EVENT_CONFIG.archivoAudio;
      audioEl.load();
    }
  }
}

/* =========================================================
   1. FONDO CON PARTÍCULAS NEÓN / VIP (CANVAS)
   ========================================================= */
function initNeonParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  const count = window.innerWidth < 768 ? 35 : 65;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const colors = [
    'rgba(0, 242, 254, ',   // Neón Cyan
    'rgba(79, 172, 254, ',  // Electric Blue
    'rgba(155, 81, 224, ',  // Purple
  ];

  class NeonParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 0.8;
      this.speedY = -(Math.random() * 0.4 + 0.15); // Flotan hacia arriba suavemente
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.opacity = Math.random() * 0.6 + 0.15;
      this.fadeSpeed = Math.random() * 0.008 + 0.003;
      this.fadeDir = Math.random() > 0.5 ? 1 : -1;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      this.opacity += this.fadeSpeed * this.fadeDir;
      if (this.opacity > 0.8) {
        this.opacity = 0.8;
        this.fadeDir = -1;
      } else if (this.opacity < 0.1) {
        this.opacity = 0.1;
        this.fadeDir = 1;
      }

      if (this.y < 0) this.y = height;
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.colorBase}${this.opacity})`;
      ctx.shadowBlur = this.size * 4;
      ctx.shadowColor = `${this.colorBase}0.8)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < count; i++) {
    particles.push(new NeonParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* =========================================================
   2. REPRODUCTOR DE AUDIO Y ACCESO VIP
   ========================================================= */
function initAudioAndWelcome() {
  const audio = document.getElementById('bg-audio');
  const btnEnter = document.getElementById('btn-enter');
  const welcomeOverlay = document.getElementById('welcome-overlay');
  const musicController = document.getElementById('music-controller');
  const btnMusicToggle = document.getElementById('btn-music-toggle');
  const musicTooltip = document.getElementById('music-tooltip');

  if (!audio) return;
  audio.volume = 0.8;

  function playAudio() {
    audio.play().then(() => {
      if (musicController) musicController.classList.add('playing');
      showMusicTooltip();
    }).catch(err => {
      console.warn('Reproducción de audio prevenida por el navegador o archivo no encontrado:', err);
    });
  }

  function pauseAudio() {
    audio.pause();
    if (musicController) musicController.classList.remove('playing');
  }

  function showMusicTooltip() {
    if (!musicTooltip) return;
    musicTooltip.classList.add('show');
    setTimeout(() => {
      musicTooltip.classList.remove('show');
    }, 3500);
  }

  // Al hacer clic en "INGRESAR A LA FIESTA"
  if (btnEnter && welcomeOverlay) {
    btnEnter.addEventListener('click', () => {
      playAudio();
      welcomeOverlay.classList.add('hidden');
      setTimeout(() => {
        welcomeOverlay.style.display = 'none';
      }, 800);
    });
  }

  // Botón flotante para pausar o reproducir
  if (btnMusicToggle) {
    btnMusicToggle.addEventListener('click', () => {
      if (audio.paused) {
        playAudio();
      } else {
        pauseAudio();
      }
    });
  }
}

/* =========================================================
   3. CUENTA REGRESIVA
   ========================================================= */
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl) return;

  function update() {
    const now = new Date().getTime();
    const target = EVENT_CONFIG.fechaInicio.getTime();
    const diff = target - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* =========================================================
   4. AGREGAR A GOOGLE CALENDAR
   ========================================================= */
function initCalendarButton() {
  const btn = document.getElementById('btn-add-calendar');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const title = encodeURIComponent(`Mis 18 - ${EVENT_CONFIG.nombre} ⚡`);
    const details = encodeURIComponent(`¡Festejamos los 18 de ${EVENT_CONFIG.nombre}!\n📍 Salón Plaza Norte (Mendoza)\n👔 Dress Code: Elegante Sport (evitar dorado)\n📋 Confirmar asistencia: ${EVENT_CONFIG.formRsvpUrl}`);
    const location = encodeURIComponent(`${EVENT_CONFIG.nombreLugar}, ${EVENT_CONFIG.direccion}`);
    
    // Formato fecha UTC para Google Calendar YYYYMMDDTHHMMSSZ
    const formatDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const startStr = formatDate(EVENT_CONFIG.fechaInicio);
    const endStr = formatDate(EVENT_CONFIG.fechaFin);

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;

    window.open(gcalUrl, '_blank');
  });
}

/* =========================================================
   5. COPIAR ALIAS CON FEEDBACK
   ========================================================= */
function initCopyAlias() {
  const btnCopy = document.getElementById('btn-copy-alias');
  const toast = document.getElementById('copy-toast');
  const copyBtnText = document.getElementById('copy-btn-text');

  if (!btnCopy) return;

  btnCopy.addEventListener('click', async () => {
    const alias = EVENT_CONFIG.aliasMP;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(alias);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = alias;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      if (copyBtnText) copyBtnText.textContent = "¡Copiado!";
      if (toast) toast.classList.add('show');

      setTimeout(() => {
        if (copyBtnText) copyBtnText.textContent = "Copiar";
        if (toast) toast.classList.remove('show');
      }, 3000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  });
}

/* =========================================================
   6. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
   ========================================================= */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
