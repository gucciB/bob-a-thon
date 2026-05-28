# Frontend File Structure Standardization

## File Extension Standard

For this React project, we use **`.jsx`** for ALL files containing React components or JSX syntax.

### Why `.jsx` for Everything?

1. **Clear Intent**: Immediately identifies React component files
2. **Consistency**: All React files use the same extension
3. **Editor Support**: Better syntax highlighting and IntelliSense
4. **Best Practice**: Modern React projects prefer `.jsx` for clarity

### Exception: Pure JavaScript

Only use `.js` for files that contain NO JSX and NO React components:
- API services (`auditService.js`)
- Utility functions
- Configuration files
- Constants

## Current File Structure

### ✅ Files to Keep (Already Correct)

```
src/
├── App.jsx                          ✅ Main application component
├── index.jsx                        ✅ Entry point with ReactDOM
├── index.css                        ✅ Global styles
├── components/
│   ├── AuditHistoryList.jsx        ✅ React component
│   ├── AuditReportViewer.jsx       ✅ React component
│   ├── ComplianceDashboard.jsx     ✅ React component
│   ├── DocumentUploadForm.jsx      ✅ React component
│   ├── Header.jsx                  ✅ React component
│   ├── ProcessingStatusBar.jsx     ✅ React component
│   ├── RiskFindingsTable.jsx       ✅ React component
│   └── Sidebar.jsx                 ✅ React component
├── context/
│   └── AuditContext.jsx            ✅ React Context (uses JSX)
└── services/
    ├── auditService.js             ✅ Pure JS API service (no JSX)
    └── mockApi.js                  ✅ Pure JS mock data (no JSX)
```

**Total: 14 files** (11 `.jsx` + 2 `.js` + 1 `.css`)

### ❌ Files to Remove (Duplicates/Old Versions)

```
src/
├── App.js                          ❌ Remove (duplicate of App.jsx)
├── index.js                        ❌ Remove (duplicate of index.jsx)
└── components/
    ├── AuditDashboard.js           ❌ Remove (old version)
    ├── AuditHistory.js             ❌ Remove (old version)
    ├── AuditReport.js              ❌ Remove (old version)
    ├── DocumentUpload.js           ❌ Remove (old version)
    └── FindingsPanel.js            ❌ Remove (old version)
```

**Total: 7 files to remove**

## Cleanup Instructions

Run these commands to remove old/duplicate files:

```bash
cd application/frontend/src

# Remove duplicate root files
rm -f App.js index.js

# Remove old component versions
rm -f components/AuditDashboard.js
rm -f components/AuditHistory.js
rm -f components/AuditReport.js
rm -f components/DocumentUpload.js
rm -f components/FindingsPanel.js
```

### Windows PowerShell

```powershell
cd application\frontend\src

# Remove duplicate root files
Remove-Item -Path App.js -ErrorAction SilentlyContinue
Remove-Item -Path index.js -ErrorAction SilentlyContinue

# Remove old component versions
Remove-Item -Path components\AuditDashboard.js -ErrorAction SilentlyContinue
Remove-Item -Path components\AuditHistory.js -ErrorAction SilentlyContinue
Remove-Item -Path components\AuditReport.js -ErrorAction SilentlyContinue
Remove-Item -Path components\DocumentUpload.js -ErrorAction SilentlyContinue
Remove-Item -Path components\FindingsPanel.js -ErrorAction SilentlyContinue
```

## Verification

After cleanup, verify the structure:

```bash
# List all JavaScript/JSX files
find src -name "*.js" -o -name "*.jsx"
```

Expected output (14 files):
```
src/App.jsx
src/index.jsx
src/components/AuditHistoryList.jsx
src/components/AuditReportViewer.jsx
src/components/ComplianceDashboard.jsx
src/components/DocumentUploadForm.jsx
src/components/Header.jsx
src/components/ProcessingStatusBar.jsx
src/components/RiskFindingsTable.jsx
src/components/Sidebar.jsx
src/context/AuditContext.jsx
src/services/auditService.js
src/services/mockApi.js
```

## Import Statements

All imports work with or without the extension:

```javascript
// ✅ With extension (explicit)
import App from './App.jsx';
import { useAudit } from './context/AuditContext.jsx';
import { submitAuditDocument } from './services/auditService.js';

// ✅ Without extension (webpack resolves automatically)
import App from './App';
import { useAudit } from './context/AuditContext';
import { submitAuditDocument } from './services/auditService';
```

Both styles work, but omitting extensions is more common in React projects.

## Summary

**Current Status:**
- ✅ 11 `.jsx` files (React components with JSX)
- ✅ 2 `.js` files (pure JavaScript services, no JSX)
- ✅ 1 `.css` file (global styles)
- ❌ 7 duplicate/old files to remove

**After Cleanup:**
- Clean, standardized structure
- All React components use `.jsx`
- Only pure JavaScript services use `.js`
- No duplicates or old versions

The project already follows best practices - just need to remove the 7 old/duplicate files!