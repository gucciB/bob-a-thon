# Frontend Troubleshooting Guide

## Issue: 'react-scripts' is not recognized

### Problem
```
'react-scripts' is not recognized as an internal or external command
```

### Cause
The `node_modules` directory is missing or `react-scripts` was not installed properly.

### Solution

**Option 1: Standard Installation**
```bash
cd application/frontend
npm install
```

**Option 2: If npm install fails or gets killed**

The installation might fail due to:
- Memory constraints
- Network issues
- Large dependency tree

Try these alternatives:

**A. Install with increased memory:**
```bash
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm install
```

**B. Install with legacy peer deps (if conflicts):**
```bash
npm install --legacy-peer-deps
```

**C. Clear cache and retry:**
```bash
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

**D. Install dependencies in batches:**

1. **Core React dependencies:**
```bash
npm install react@^18.2.0 react-dom@^18.2.0 react-scripts@5.0.1
```

2. **UI and styling:**
```bash
npm install tailwindcss@^3.3.6 postcss@^8.4.32 autoprefixer@^10.4.16 @heroicons/react@^2.1.1
```

3. **Data and API:**
```bash
npm install axios@^1.6.0 recharts@^2.10.0
```

4. **File handling and markdown:**
```bash
npm install react-dropzone@^14.2.3 react-markdown@^9.0.0 remark-gfm@^4.0.0
```

5. **Utilities:**
```bash
npm install uuid@^9.0.1 react-router-dom@^6.20.0 @headlessui/react@^1.7.17
```

**E. Use Yarn instead (if available):**
```bash
yarn install
```

## Verification

After installation, verify react-scripts is installed:

```bash
# Check if react-scripts exists
Get-ChildItem node_modules\.bin\react-scripts.cmd

# Or check package
npm list react-scripts
```

Expected output:
```
compliance-audit-platform@1.0.0
└── react-scripts@5.0.1
```

## Starting the Application

Once dependencies are installed:

```bash
npm start
```

The application should open at http://localhost:3000

## Common Errors

### Error: ENOSPC (No space left)
```bash
# Increase file watchers (Linux/Mac)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Error: Port 3000 already in use
```bash
# Use different port
$env:PORT=3001
npm start
```

### Error: Module not found
```bash
# Reinstall specific module
npm install <module-name>

# Or reinstall all
Remove-Item -Recurse node_modules
npm install
```

### Error: Heap out of memory
```bash
# Increase Node memory
$env:NODE_OPTIONS="--max-old-space-size=8192"
npm start
```

## Alternative: Use Create React App

If all else fails, you can recreate the React app:

```bash
# Backup src folder
Copy-Item -Recurse src src_backup

# Create new React app
npx create-react-app compliance-audit-platform-new

# Copy source files
Copy-Item -Recurse src_backup/* compliance-audit-platform-new/src/

# Copy configuration
Copy-Item package.json compliance-audit-platform-new/
Copy-Item .env compliance-audit-platform-new/
Copy-Item .env.example compliance-audit-platform-new/

# Install additional dependencies
cd compliance-audit-platform-new
npm install axios recharts react-dropzone react-markdown remark-gfm uuid react-router-dom @headlessui/react @heroicons/react
npm install -D tailwindcss postcss autoprefixer
```

## Getting Help

If issues persist:

1. Check Node.js version: `node --version` (should be 16+)
2. Check npm version: `npm --version` (should be 8+)
3. Check npm logs: `Get-Content ~/.npm/_logs/*-debug-0.log`
4. Try with administrator privileges
5. Check antivirus/firewall settings

## Quick Fix Script

Save this as `fix-install.ps1`:

```powershell
# Fix Frontend Installation Script
Write-Host "Cleaning up..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "Installing dependencies..." -ForegroundColor Green
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm install --legacy-peer-deps

Write-Host "Verifying installation..." -ForegroundColor Green
npm list react-scripts

Write-Host "Done! Run 'npm start' to launch the application." -ForegroundColor Green
```

Run with:
```powershell
.\fix-install.ps1