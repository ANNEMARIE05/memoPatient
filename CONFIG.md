# ⚙️ Configuration finale - Memo Patient

## 📁 Structure des fichiers de configuration

```
memoPatient/
├── vite.config.ts          # Configuration Vite + Tailwind CSS v4
├── tailwind.config.ts      # Configuration Tailwind CSS
├── tsconfig.app.json       # Configuration TypeScript
├── package.json           # Dépendances
└── src/
    ├── main.ts            # Point d'entrée avec router
    ├── App.vue           # Composant principal
    ├── style.css         # Styles globaux + Tailwind
    └── types/
        └── global.d.ts   # Types globaux
```

## 🔧 Configuration Vite

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    hmr: {
      overlay: false  // Désactive l'overlay d'erreur
    }
  }
})
```

## 🎨 Configuration Tailwind CSS

### tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
```

## 📝 Configuration TypeScript

### tsconfig.app.json
```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue", "src/**/*.d.ts"]
}
```

## 🎯 Dépendances principales

### package.json
```json
{
  "dependencies": {
    "@fortawesome/fontawesome-svg-core": "^7.0.1",
    "@fortawesome/free-solid-svg-icons": "^7.0.1",
    "@fortawesome/vue-fontawesome": "^3.1.2",
    "vue": "^3.5.18",
    "vue-router": "^4.5.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.13",
    "@tailwindcss/vite": "^4.1.13",
    "@vitejs/plugin-vue": "^6.0.1",
    "@vue/tsconfig": "^0.7.0",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.13",
    "typescript": "~5.8.3",
    "vite": "^7.1.2",
    "vue-tsc": "^3.0.5"
  }
}
```

## 🚀 Commandes disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Prévisualisation
npm run preview
```

## 🎨 Styles globaux

### src/style.css
```css
@import 'tailwindcss';

/* Animations personnalisées */
@keyframes fadeIn { ... }
@keyframes slideIn { ... }
@keyframes pulse { ... }

.animate-fade-in { ... }
.animate-slide-in { ... }
.animate-pulse-slow { ... }

/* Scrollbar personnalisée */
::-webkit-scrollbar { ... }
```

## 🔐 Authentification

- **Email** : `admin@test.com`
- **Mot de passe** : `Admin123@`
- **Protection** : Routes protégées avec `AuthGuard`
- **Stockage** : LocalStorage pour la session

## 📱 Responsive Design

- **Desktop** : Sidebar fixe (256px) + contenu décalé
- **Tablet** : Adaptation des grilles
- **Mobile** : Interface optimisée (à implémenter)

---

**Configuration optimale pour le développement et la production !** ⚙️
