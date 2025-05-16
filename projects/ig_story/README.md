# Italgas p2g

Un progetto di visualizzazione 3D creato con Three.js e Vite, con supporto per shader GLSL e animazioni GSAP.

## 📋 Requisiti

- [Node.js](https://nodejs.org/) (versione 16.x o superiore consigliata)
- npm o yarn

## 🚀 Installazione

Clona il repository e installa le dipendenze:

```bash
# Clona il repository
git clone https://github.com/bitmama-reply/p2g
cd p2g

# Installa le dipendenze
npm install
# oppure
yarn
```

## 🛠️ Comandi disponibili

```bash
# Avvia il server di sviluppo (accessibile da altri dispositivi nella rete locale)
npm run dev
# oppure
yarn dev

# Crea la build per la produzione
npm run build
# oppure
yarn build

# Visualizza in anteprima la build di produzione
npm run preview
# oppure
yarn preview
```

## 🧰 Tecnologie utilizzate

### Core
- [Three.js](https://threejs.org/) - Libreria per la creazione di scene 3D
- [Vite](https://vitejs.dev/) - Build tool e development server

### Grafica e animazioni
- [GLSL](https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders) - Shading Language per WebGL (supportato tramite vite-plugin-glsl)
- [GSAP](https://greensock.com/gsap/) - Libreria per animazioni avanzate

### Strumenti di sviluppo
- [lil-gui](https://lil-gui.georgealways.com/) - Interfaccia GUI per il debug
- [Tweakpane](https://tweakpane.github.io/docs/) - Alternativa GUI per il controllo dei parametri
- [Stats.js](https://github.com/mrdoob/stats.js/) - Monitoraggio delle performance

### Generazione procedurale
- [simplex-noise](https://www.npmjs.com/package/simplex-noise) - Algoritmo di rumore per generazione procedurale
- [alea](https://www.npmjs.com/package/alea) - Generatore di numeri pseudo-casuali

### Utilità
- [sharp](https://sharp.pixelplumbing.com/) - Processamento e manipolazione di immagini
- [fs-extra](https://www.npmjs.com/package/fs-extra) - Utilità per il file system estese

### Styling
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [PostCSS](https://postcss.org/) - Strumento per la trasformazione di CSS con JavaScript
  - autoprefixer
  - postcss-nested

## 📁 Struttura del progetto

```
ig/
├── public/          # File statici accessibili direttamente
├── src/             # Codice sorgente del progetto
│   ├── components/  # Componenti riutilizzabili
│   ├── shaders/     # Shader GLSL (.vert, .frag, etc.)
│   ├── utils/       # Funzioni di utilità
│   ├── main.js      # Punto di ingresso dell'applicazione
│   └── style.css    # Stili CSS/Tailwind
├── index.html       # File HTML principale
├── vite.config.js   # Configurazione di Vite
└── package.json     # Dipendenze e script
```

## 📝 Note

- Il progetto utilizza `vite-plugin-glsl` per importare direttamente i file shader GLSL
- È configurato per essere accessibile da altri dispositivi nella rete locale tramite `--host`
- Include strumenti per il debug e l'ottimizzazione delle performance (Stats.js)

## 🔧 Configurazione

È possibile personalizzare la configurazione di Vite modificando il file `vite.config.js`. Per la configurazione di Tailwind CSS, fare riferimento al file `tailwind.config.js`.

## 📄 Licenza

[MIT](LICENSE) © Bitmama Reply per Italgas p2g