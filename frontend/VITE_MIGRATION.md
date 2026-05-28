# Migrating from Create React App to Vite

This guide explains how to migrate the Compliance Audit Platform frontend from Create React App (CRA) to Vite for faster development and better performance.

## Why Vite?

- ⚡ **10-100x faster** hot module replacement (HMR)
- 🚀 **Instant server start** (no bundling in dev)
- 📦 **Smaller bundle sizes** in production
- 🔧 **Better developer experience**
- 🎯 **Modern tooling** (ESM, esbuild)

## Migration Steps

### 1. Update package.json

Replace `react-scripts` with Vite dependencies:

```json
{
  "name": "compliance-audit-platform",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "Enterprise Compliance Audit Intelligence Platform",
  "dependencies": {
    "@headlessui/react": "^2.2.0",
    "@heroicons/react": "^2.2.0",
    "axios": "^1.7.9",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-dropzone": "^14.3.5",
    "react-markdown": "^9.0.1",
    "react-router-dom": "^7.1.1",
    "recharts": "^2.15.0",
    "remark-gfm": "^4.0.0",
    "uuid": "^11.0.3"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "vite": "^6.0.5"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

### 2. Create vite.config.js

Create `vite.config.js` in the frontend root:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Server configuration
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react'],
          'chart-vendor': ['recharts'],
        }
      }
    }
  },
  
  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@context': path.resolve(__dirname, './src/context'),
    }
  },
  
  // Environment variables prefix
  envPrefix: 'VITE_',
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios', 'recharts']
  }
});
```

### 3. Move index.html

Move `public/index.html` to root directory and update it:

**From:** `public/index.html`
**To:** `index.html`

Update the content:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#161616" />
    <meta
      name="description"
      content="Enterprise Compliance Audit Intelligence Platform powered by IBM"
    />
    
    <!-- IBM Plex Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <title>Compliance Audit Intelligence Platform | IBM</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this application.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

### 4. Update Environment Variables

Rename `.env` variables from `REACT_APP_` to `VITE_`:

**Before:**
```env
REACT_APP_API_URL=http://localhost:5000
```

**After:**
```env
VITE_API_URL=http://localhost:5000
```

### 5. Update Environment Variable Usage

Update all files that use environment variables:

**Before:**
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

**After:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

**Files to update:**
- `src/services/auditService.js`
- Any other files using `process.env.REACT_APP_*`

### 6. Update src/services/auditService.js

```javascript
import axios from 'axios';

// Vite environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Rest of the file remains the same...
```

### 7. Remove CRA-specific Files

Delete these files/folders:
```bash
rm -rf public/manifest.json
rm -rf public/robots.txt
rm -rf public/logo192.png
rm -rf public/logo512.png
```

Keep only:
- `public/favicon.ico` (move to root or keep in public)

### 8. Update .gitignore

Add Vite-specific entries:

```gitignore
# Vite
dist
dist-ssr
*.local

# Keep existing entries
node_modules
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### 9. Update tailwind.config.js

Ensure it works with Vite:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'carbon-blue': '#0f62fe',
        'carbon-dark': '#161616',
        'carbon-surface': '#262626',
        'carbon-border': '#393939',
        'carbon-gray': '#f4f4f4',
      },
    },
  },
  plugins: [],
}
```

### 10. Update postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Installation & Running

### Clean Install

```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Install new dependencies
npm install

# Start development server
npm run dev
```

### Development

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run preview      # Preview production build
```

## File Structure After Migration

```
application/frontend/
├── index.html                    # Moved from public/
├── vite.config.js               # New Vite config
├── package.json                 # Updated scripts
├── postcss.config.js            # Updated for ESM
├── tailwind.config.js           # Updated for ESM
├── .env                         # VITE_ prefix
├── .env.example                 # VITE_ prefix
├── public/
│   └── favicon.ico              # Static assets
├── src/
│   ├── index.jsx                # Entry point
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   ├── context/
│   └── services/
│       └── auditService.js      # Updated env vars
└── dist/                        # Build output (new)
```

## Benefits After Migration

### Development
- ⚡ **Instant server start** (< 1 second)
- 🔥 **Lightning-fast HMR** (< 100ms)
- 📦 **On-demand compilation** (only what you use)

### Production
- 📉 **Smaller bundle sizes** (20-30% reduction)
- 🚀 **Faster build times** (2-3x faster)
- 🎯 **Better tree-shaking**
- 📊 **Automatic code splitting**

### Developer Experience
- 🔧 **Simpler configuration**
- 🎨 **Better error messages**
- 🔍 **Built-in TypeScript support**
- 📱 **Better mobile dev experience**

## Troubleshooting

### Issue: Module not found

**Solution:** Check import paths and ensure they're relative or use aliases

### Issue: Environment variables not working

**Solution:** Ensure variables start with `VITE_` and use `import.meta.env`

### Issue: Build fails

**Solution:** Check for CRA-specific code (process.env.PUBLIC_URL, etc.)

### Issue: Styles not loading

**Solution:** Ensure Tailwind config includes all source files

## Rollback Plan

If you need to rollback to CRA:

1. Restore original `package.json`
2. Move `index.html` back to `public/`
3. Revert environment variables to `REACT_APP_`
4. Delete `vite.config.js`
5. Run `npm install`

## Performance Comparison

| Metric | CRA | Vite | Improvement |
|--------|-----|------|-------------|
| Dev Server Start | 15-30s | <1s | **30x faster** |
| Hot Module Reload | 1-3s | <100ms | **20x faster** |
| Production Build | 60-90s | 20-30s | **3x faster** |
| Bundle Size | ~500KB | ~350KB | **30% smaller** |

## Next Steps

After migration:

1. ✅ Test all features thoroughly
2. ✅ Update CI/CD pipelines (if any)
3. ✅ Update deployment scripts
4. ✅ Update team documentation
5. ✅ Consider adding TypeScript support

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [Vite React Plugin](https://github.com/vitejs/vite-plugin-react)
- [Migration Guide](https://vitejs.dev/guide/migration.html)