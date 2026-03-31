// ============================================
// MÓDULO ZOHAR — EL LIBRO DEL ESPLENDOR
// ============================================
import { SEFIROT, ORACLE_PASSAGES, SECTIONS } from './zohar-data.js';

let moduleContainer = null;
let selectedSefirah = null;

export function init(container) {
  moduleContainer = container;
  container.innerHTML = ''; // Limpiar

  // Añadir estilos si no existen
  if (!document.getElementById('zohar-styles')) {
    const link = document.createElement('link');
    link.id = 'zohar-styles';
    link.rel = 'stylesheet';
    link.href = './modulos/zohar/zohar.css';
    document.head.appendChild(link);
  }

  container.innerHTML = crearHTML();

  renderSefirot();
  renderSections();
  bindEvents();
}

function crearHTML() {
  return `
    <div class="zohar-module">
      <div style="text-align:center; margin-bottom:30px;">
        <div class="hebrew-title">זֹהַר</div>
        <div style="font-size:1rem; letter-spacing:0.6em; color:rgba(212,168,67,0.5);">Zohar</div>
        <div style="font-size:1.3rem; font-style:italic; color:rgba(240,234,255,0.5);">El Libro del Esplendor</div>
      </div>

      <div class="ethical-note">
        Ninguna de estas herramientas recopila información personal. Son espejos — te muestran quién eres hoy, para que elijas quién quieres ser mañana.
      </div>

      <div class="mode-selector">
        <div class="mode-tabs">
          <button class="mode-tab active" data-mode="oracle">
            <span style="font-size:1.4rem; display:block;">🔮</span>
            <span>Oráculo</span>
          </button>
          <button class="mode-tab" data-mode="explore">
            <span style="font-size:1.4rem; display:block;">📜</span>
            <span>Explorar</span>
          </button>
        </div>
      </div>

      <!-- Panel Oráculo -->
      <div class="panel active" id="zohar-panel-oracle">
        <div style="text-align:center; padding:20px 0;">
          <p style="font-style:italic; color:rgba(240,234,255,0.55); max-width:480px; margin:0 auto 36px;">
            El Zohar enseña que cada alma lleva una pregunta que el universo espera responder. Formula tu pregunta y elige la Sefirá.
          </p>

          <div style="background:rgba(212,168,67,0.04); border:1px solid rgba(212,168,67,0.2); border-radius:6px; padding:24px; margin-bottom:28px; max-width:560px; margin-left:auto; margin-right:auto;">
            <label style="font-family:'Secular One',sans-serif; font-size:0.6rem; letter-spacing:0.5em; color:#d4a843; display:block; margin-bottom:14px;">Tu Pregunta al Zohar</label>
            <textarea id="zohar-question" placeholder="¿Qué pregunta lleva tu alma hoy...?" style="width:100%; background:transparent; border:none; border-bottom:1px solid rgba(212,168,67,0.25); color:#f0eaff; font-size:1.05rem; font-style:italic; padding:10px 4px; resize:none; height:70px; outline:none;"></textarea>
          </div>

          <div style="font-family:'Secular One',sans-serif; font-size:0.6rem; letter-spacing:0.5em; color:rgba(212,168,67,0.5); margin:28px 0 20px;">Elige la Sefirá — Emanación Divina</div>
          <div class="sefirot-grid" id="zohar-sefirot-grid"></div>

          <button class="consult-btn" id="zohar-consult-btn">✦ Abrir el Libro ✦</button>

          <div id="zohar-response" style="display:none; max-width:620px; margin:40px auto 0;">
            <div class="response-card">
              <span class="response-sefirah-tag" id="zohar-resp-hebrew"></span>
              <span style="font-family:'Secular One',sans-serif; font-size:0.55rem; letter-spacing:0.5em; color:rgba(212,168,67,0.5); display:block; margin-bottom:24px;" id="zohar-resp-name"></span>
              <div class="response-text" id="zohar-resp-text"></div>
              <div class="response-verse" id="zohar-resp-verse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Explorar -->
      <div class="panel" id="zohar-panel-explore">
        <div style="padding:30px 0;">
          <p style="font-style:italic; color:rgba(240,234,255,0.5); text-align:center; margin-bottom:32px;">
            El Zohar fue escrito en arameo por Moisés de León en el siglo XIII. Explora sus enseñanzas sobre la Creación, el alma y los misterios divinos.
          </p>

          <div id="zohar-section-content" class="section-content" style="display:none;"></div>
          <div class="zohar-sections" id="zohar-sections"></div>
        </div>
      </div>
    </div>
  `;
}

function renderSefirot() {
  const grid = moduleContainer.querySelector('#zohar-sefirot-grid');
  if (!grid) return;
  grid.innerHTML = '';
  selectedSefirah = null;

  SEFIROT.forEach((s, i) => {
    const btn = document.createElement('div');
    btn.className = 'sefirah-btn';
    btn.dataset.index = i;
    btn.innerHTML = `
      <span class="sefirah-hebrew" style="color:${s.color}">${s.hebrew}</span>
      <span style="font-size:0.8rem; font-style:italic; display:block;">${s.name}</span>
      <span style="font-size:0.65rem; opacity:0.6; display:block;">${s.concept}</span>
    `;
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.sefirah-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSefirah = s;
    });
    grid.appendChild(btn);
  });
}

function renderSections() {
  const sectionsDiv = moduleContainer.querySelector('#zohar-sections');
  if (!sectionsDiv) return;
  sectionsDiv.innerHTML = '';

  SECTIONS.forEach((sec) => {
    const card = document.createElement('div');
    card.className = 'section-card';
    card.innerHTML = `
      <div class="section-hebrew">${sec.hebrew}</div>
      <div style="font-family:'Secular One',sans-serif; font-size:0.75rem; letter-spacing:0.2em; color:#f0cb6a; margin-bottom:8px;">${sec.name}</div>
      <div style="font-size:0.85rem; color:rgba(240,234,255,0.45); font-style:italic;">${sec.desc}</div>
    `;
    card.addEventListener('click', () => openZoharSection(sec));
    sectionsDiv.appendChild(card);
  });
}

function bindEvents() {
  // Pestañas de modo
  const modeTabs = moduleContainer.querySelectorAll('.mode-tab');
  modeTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const mode = tab.dataset.mode;
      modeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      moduleContainer.querySelector('#zohar-panel-oracle').classList.toggle('active', mode === 'oracle');
      moduleContainer.querySelector('#zohar-panel-explore').classList.toggle('active', mode === 'explore');
    });
  });

  // Botón de consulta
  const consultBtn = moduleContainer.querySelector('#zohar-consult-btn');
  if (consultBtn) {
    consultBtn.addEventListener('click', consultZohar);
  }
}

function consultZohar() {
  let selected = selectedSefirah;
  if (!selected) {
    const idx = Math.floor(Math.random() * SEFIROT.length);
    selected = SEFIROT[idx];
    const grid = moduleContainer.querySelector('#zohar-sefirot-grid');
    grid.querySelectorAll('.sefirah-btn')[idx]?.classList.add('selected');
    selectedSefirah = selected;
  }

  const responseDiv = moduleContainer.querySelector('#zohar-response');
  const respText = moduleContainer.querySelector('#zohar-resp-text');
  const respHebrew = moduleContainer.querySelector('#zohar-resp-hebrew');
  const respName = moduleContainer.querySelector('#zohar-resp-name');
  const respVerse = moduleContainer.querySelector('#zohar-resp-verse');

  const pasajes = ORACLE_PASSAGES[selected.name] || ORACLE_PASSAGES['Tiferet'];
  const pasaje = pasajes[Math.floor(Math.random() * pasajes.length)];

  respHebrew.textContent = selected.hebrew;
  respName.textContent = `${selected.name} · ${selected.concept}`;
  respVerse.textContent = '';
  responseDiv.style.display = 'block';

  respText.style.opacity = '0';
  respText.textContent = pasaje.texto;
  respText.style.transition = 'opacity 1.2s ease';

  setTimeout(() => {
    respText.style.opacity = '1';
    setTimeout(() => {
      respVerse.style.opacity = '0';
      respVerse.textContent = pasaje.verso;
      respVerse.style.transition = 'opacity 1s ease';
      setTimeout(() => respVerse.style.opacity = '1', 50);
    }, 800);
  }, 100);

  responseDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openZoharSection(sec) {
  const display = moduleContainer.querySelector('#zohar-section-content');
  display.innerHTML = `
    <button class="close-section" id="close-section-btn">✕</button>
    <div style="font-size:2rem; margin-bottom:12px;" class="section-hebrew">${sec.hebrew} — ${sec.name}</div>
    <div class="section-content-hebrew">${sec.hebrewText}</div>
    <div class="section-content-text">${sec.content}</div>
    <div style="margin-top:24px; text-align:center;">
      <button class="consult-btn" style="padding:10px 24px; font-size:0.6rem;" id="ask-section-btn">
        ✦ Preguntar sobre este texto ✦
      </button>
    </div>
  `;
  display.style.display = 'block';
  display.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Evento cerrar
  display.querySelector('#close-section-btn').addEventListener('click', () => {
    display.style.display = 'none';
  });

  // Evento preguntar
  display.querySelector('#ask-section-btn').addEventListener('click', () => {
    // Cambiar a modo oráculo
    const oracleTab = moduleContainer.querySelector('.mode-tab[data-mode="oracle"]');
    if (oracleTab) oracleTab.click();
    const questionBox = moduleContainer.querySelector('#zohar-question');
    if (questionBox) {
      questionBox.value = `¿Qué enseña el Zohar en la sección de ${sec.name} sobre mi vida en este momento?`;
    }
  });
}
