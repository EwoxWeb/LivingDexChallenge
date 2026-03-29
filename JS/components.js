// ── Données à modifier ici ────────────────────────────────────────────────
const LIVING_DEX_DATA = {
  total: 1113,
  caught: fetchCaught(),
  async getData() {
    const caught = await this.caught;
    const percent = (caught * 100 / this.total).toFixed(2);
    return { caught, total: this.total, percent };
  }
};

async function fetchCaught() {
  try {
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSpCDxKke7zdiiaHYbixspzcOzTT-rbmZkD2fd8b5nf3zRaSufYhLFljVcXcK9LZwpkZD1SngX87N35/pub?gid=962192939&output=csv');
    const csv = await response.text();
    const lines = csv.split('\n');
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      const cells = firstLine.split(',');
      return parseInt(cells[1]) || 1037;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
  return 1037; // valeur par défaut
}

async function fetchTopData() {
  try {
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSpCDxKke7zdiiaHYbixspzcOzTT-rbmZkD2fd8b5nf3zRaSufYhLFljVcXcK9LZwpkZD1SngX87N35/pub?gid=1727117815&output=csv&t=' + Date.now());
    const csv = await response.text();
    console.log('CSV top récupéré :', csv.substring(0, 200));
    const lines = csv.split('\n');
    if (lines.length >= 2) {
      const names = lines[0].split(',').slice(1);
      const scores = lines[1].split(',').slice(1);
      console.log('Names:', names);
      console.log('Scores:', scores);
      const players = names.map((name, i) => ({
        name: name.trim(),
        score: parseInt(scores[i]) || 0
      })).filter(p => p.name && p.score > 0).sort((a, b) => b.score - a.score);
      console.log('Players triés:', players.slice(0, 10));
      return players;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données du top :', error);
  }
  return [];
}

// Rendre globale pour l'utiliser dans player.html
window.fetchPlayerPokemon = async function(playerName) {
  try {
    console.log('Début fetchPlayerPokemon pour:', playerName);
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSpCDxKke7zdiiaHYbixspzcOzTT-rbmZkD2fd8b5nf3zRaSufYhLFljVcXcK9LZwpkZD1SngX87N35/pub?gid=1727117815&output=csv&t=' + Date.now());
    const csv = await response.text();
    console.log('CSV récupéré, longueur:', csv.length);
    const lines = csv.split('\n');
    console.log('Nombre de lignes:', lines.length);
    
    if (lines.length >= 2) {
      const names = lines[0].split(',').slice(1);
      console.log('Noms trouvés:', names);
      const playerIndex = names.findIndex(n => n.trim() === playerName);
      console.log('Index du joueur', playerName, ':', playerIndex);
      
      if (playerIndex === -1) {
        console.error('Joueur non trouvé:', playerName);
        return [];
      }
      
      // Récupère tous les pokemon du joueur (à partir de la ligne 3 = index 2)
      const pokemonList = [];
      for (let i = 2; i < lines.length; i++) {
        const cells = lines[i].split(',');
        const pokemon = cells[playerIndex + 1]?.trim();
        if (pokemon && pokemon.length > 0) {
          pokemonList.push(pokemon);
        }
      }
      
      console.log('Pokemon list complète:', pokemonList);
      const filtered = pokemonList.filter(p => p.length > 0);
      console.log('Pokemon list filtrée:', filtered);
      return filtered;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des pokemon :', error);
  }
  return [];
};

// Rendre globale pour l'utiliser dans top.html
window.fetchTopData = fetchTopData;

// ── NavBar Web Component ───────────────────────────────────────────────────
// Usage : <nav-bar></nav-bar>

class NavBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav>
        <div class="nav-logo"><a href="index.html"><span>✦</span> Shiny Community's Challenge</a></div>
        <div class="nav-links" id="nav-links">
          <a href="Living_Dex_1G.html">✨ Shiny Card</a>
          <a href="top.html">🏆 Top Hunter</a>
          <a href="Rules.html">📋 Règles</a>
        </div>
        <button class="hamburger" id="hamburger" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </nav>
      <style>
        /* Force l'alignement identique sur toutes les pages */
        nav {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          height: 60px !important;
        }
        .nav-logo {
          display: flex !important;
          align-items: center !important;
          gap: .5rem;
          line-height: 1;
          margin: 0;
          padding: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
          flex-shrink: 1;
        }
        .nav-logo a { text-decoration: none; color: inherit; }
        .nav-logo a:visited { color: inherit; }
 
        /* Hamburger — caché sur desktop */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: .4rem;
          background: none;
          border: none;
          flex-shrink: 0;
        }
        .hamburger span {
          display: block;
          width: 22px; height: 2px;
          background: #9ec9f0;
          border-radius: 2px;
          transition: all .25s cubic-bezier(.4,0,.2,1);
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
 
        @media (max-width: 640px) {
          .nav-logo { font-size: 1.05rem; }
          .hamburger { display: flex; }
          #nav-links {
            display: none;
            flex-direction: column;
            gap: 0;
            position: absolute;
            top: 60px; left: 0; right: 0;
            background: rgba(17, 28, 46, .97);
            border-bottom: 1px solid rgba(96,180,255,.15);
            padding: .5rem 0;
            z-index: 99;
          }
          #nav-links.open { display: flex; }
          #nav-links a {
            padding: .75rem 1.5rem;
            border-radius: 0;
            font-size: 1rem;
          }
        }
      </style>`;
 
    const btn   = this.querySelector('#hamburger');
    const links = this.querySelector('#nav-links');
    if (btn && links) {
      btn.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
      });
      document.addEventListener('click', (e) => {
        if (!this.contains(e.target)) {
          links.classList.remove('open');
          btn.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }
}

customElements.define('nav-bar', NavBar);

class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <a href="https://discord.gg/JFPrVQV" target="_blank">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
          Discord
        </a>
        <a href="https://www.youtube.com/channel/UCfYXuvKn8WUVhSS4Os8AJtg" target="_blank">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          YouTube
        </a>
        <a href="MentionsLegales.html">
          Mentions Légales
        </a>
      </footer>`;
  }
}

customElements.define('footer-bar', Footer);


// ── ProgressBar Web Component ──────────────────────────────────────────────
// Usage : <progress-bar></progress-bar>

class ProgressBar extends HTMLElement {
  connectedCallback() {
    LIVING_DEX_DATA.getData().then(({ percent, caught, total }) => {
      this.innerHTML = `
        <div class="progress-wrap">
          <div class="progress-header">
            <span class="progress-label">Complétion globale (hors bonus)</span>
            <span class="progress-nums">
              ${percent}%
              <small>${caught} / ${total}</small>
            </span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" data-percent="${percent}"></div>
          </div>
        </div>`;

      requestAnimationFrame(() => {
        setTimeout(() => {
          const bar = this.querySelector('.bar-fill');
          if (bar) bar.style.width = percent + '%';
        }, 80);
      });
    });
  }
}

customElements.define('progress-bar', ProgressBar);


// ── DexHeader Web Component ────────────────────────────────────────────────
// Regroupe : navbar + hero + progress bar + onglets de génération
// Usage : <dex-header active="1G"></dex-header>
// L'attribut active détermine quel onglet est surligné (1G, 2G, ... Bonus)

// ── Générations terminées ─────────────────────────────────────────────────
// Ajoute ou retire un identifiant de tab pour marquer la génération comme complète.
// Les identifiants disponibles sont : '1G','2G','3G','4G','5G','6G','7G','8G','9G','Forme','Bonus'
const COMPLETED_GENS = ['1G'];
// ──────────────────────────────────────────────────────────────────────────

const TABS = ['1G','2G','3G','4G','5G','6G','7G','8G','9G','Formes','Bonus'];

class DexHeader extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active') || '1G';

    const tabsHTML = TABS.map(tab => {
      const isActive    = tab === active;
      const isCompleted = COMPLETED_GENS.includes(tab);
      return `
        <div class="tab-wrap${isCompleted ? ' tab-completed' : ''}">
          ${isCompleted ? '<span class="tab-star">✦</span>' : ''}
          <a href="Living_Dex_${tab}.html" class="tab${isActive ? ' active' : ''}">${tab}</a>
        </div>`;
    }).join('');

    this.innerHTML = `
      <nav-bar></nav-bar>

      <section class="hero">
        <div class="hero-eyebrow">✦ Shiny Community's Challenge</div>
        <h1>Living Shiny Dex</h1>
        <p>Suivez la progression collective de la communauté</p>
        <progress-bar></progress-bar>
      </section>

      <div class="tabs-wrap">
        ${tabsHTML}
      </div>

      <h2 class="section-title">Living Dex <span>${active}</span></h2>

      <style>
        .tab-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .2rem;
        }
        .tab-star {
          font-size: .7rem;
          line-height: 1;
          height: .7rem;
          color: #FFD700;
          text-shadow: 0 0 8px rgba(255, 215, 0, .7);
          animation: starPulse 2s ease-in-out infinite;
        }
        /* Espace réservé pour les onglets sans étoile (alignement) */
        .tab-wrap:not(.tab-completed)::before {
          content: '';
          display: block;
          height: .7rem;
        }
        @keyframes starPulse {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%       { opacity: .6; transform: scale(.85); }
        }
      </style>`;
  }
}

customElements.define('dex-header', DexHeader);
