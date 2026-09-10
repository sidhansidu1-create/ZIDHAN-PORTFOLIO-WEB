# Antigravity & AI Agent Coding Rules — Muhammed Sidhan Portfolio

## ⚠️ CRITICAL BUILD & INTEGRITY RULES

1. **NEVER RUN INLINE POWERSHELL CSS/JS MINIFIERS**
   - **DO NOT** run `node -e "... replace(/.../, '$1')"` or any inline command in PowerShell.
   - PowerShell treats `$1` as a shell variable and deletes all colons, semicolons, brackets, and braces.
   - This corrupts `style.min.css` and destroys the entire live website UI.

2. **ALWAYS USE THE OFFICIAL BUILD PIPELINE**
   - Whenever `style.css` or `script.js` is modified, you **MUST** run:
     ```bash
     node build.js
     ```
   - This script safely minifies assets and runs strict automated syntax and integrity checks before writing to disk.

3. **VERIFY ASSETS BEFORE EVERY COMMIT**
   - Run:
     ```bash
     node build.js --verify
     ```
   - A Git pre-commit hook is installed at `.git/hooks/pre-commit` to prevent committing corrupted assets.

4. **REFER TO THE MASTER ARCHITECTURE DOCUMENT**
   - Read `ARCHITECTURE.md` before making architectural, styling, layout, or script modifications.
   - Preserves all brand identity, responsive breakpoints, Cloudflare worker bindings, and interactive modules.
