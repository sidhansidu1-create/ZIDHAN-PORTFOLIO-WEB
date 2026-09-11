/**
 * Build & Validation Pipeline - Muhammed Sidhan Portfolio
 * 
 * Usage:
 *   node build.js          -> Safely minifies style.css and script.js with strict validation
 *   node build.js --verify -> Verifies integrity of production assets (used in CI/pre-commit)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const STYLE_SRC = path.join(ROOT_DIR, 'style.css');
const STYLE_MIN = path.join(ROOT_DIR, 'style.min.css');
const SCRIPT_SRC = path.join(ROOT_DIR, 'script.js');
const SCRIPT_MIN = path.join(ROOT_DIR, 'script.min.js');

function countChar(str, ch) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ch) count++;
  }
  return count;
}

function validateCSS(css, filename) {
  console.log(`Checking ${filename} integrity...`);
  
  if (css.length < 20000) {
    throw new Error(`[CRITICAL] ${filename} is suspiciously small (${css.length} bytes). Aborting!`);
  }

  const openBraces = countChar(css, '{');
  const closeBraces = countChar(css, '}');
  if (openBraces !== closeBraces) {
    throw new Error(`[CRITICAL] ${filename} has unbalanced braces: { = ${openBraces}, } = ${closeBraces}`);
  }

  const colons = countChar(css, ':');
  const semicolons = countChar(css, ';');
  if (colons < 500 || semicolons < 500) {
    throw new Error(`[CRITICAL] ${filename} is missing essential punctuation (: = ${colons}, ; = ${semicolons}). Punctuation may have been stripped!`);
  }

  if (!css.includes(':root') || !css.includes('--bg-color:#050505;') || !css.includes('--accent-color:#00f2fe;')) {
    throw new Error(`[CRITICAL] ${filename} is missing vital CSS root tokens. Aborting!`);
  }

  if (!css.includes('@media')) {
    throw new Error(`[CRITICAL] ${filename} is missing media queries. Responsive design compromised!`);
  }

  console.log(`  [PASS] ${filename} verified: ${css.length} bytes, ${openBraces} rules, ${colons} declarations, all syntax balanced.`);
}

function validateJS(js, filename) {
  console.log(`Checking ${filename} integrity...`);
  
  if (js.length < 15000) {
    throw new Error(`[CRITICAL] ${filename} is suspiciously small (${js.length} bytes). Aborting!`);
  }

  const openBraces = countChar(js, '{');
  const closeBraces = countChar(js, '}');
  if (openBraces !== closeBraces) {
    throw new Error(`[CRITICAL] ${filename} has unbalanced braces: { = ${openBraces}, } = ${closeBraces}`);
  }

  const vm = require('vm');
  try {
    new vm.Script(js, { filename });
  } catch (err) {
    throw new Error(`[CRITICAL] ${filename} JavaScript syntax error: ${err.message}`);
  }

  console.log(`  [PASS] ${filename} verified: ${js.length} bytes, valid JavaScript syntax.`);
}

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([\{\}\:\;\,\>\+\~])\s*/g, (m, char) => char)
    .replace(/;\}/g, '}')
    .trim();
}

function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//')) return '';
      return trimmed;
    })
    .filter(line => line.length > 0)
    .join('\n');
}

function build() {
  console.log('=== RUNNING PRODUCTION BUILD & SANITY SUITE ===');

  if (!fs.existsSync(STYLE_SRC)) {
    throw new Error(`Missing source file: ${STYLE_SRC}`);
  }

  const rawCSS = fs.readFileSync(STYLE_SRC, 'utf8');
  console.log(`Read style.css: ${rawCSS.length} bytes`);

  const minifiedCSS = minifyCSS(rawCSS);
  console.log(`Minified CSS output: ${minifiedCSS.length} bytes`);

  // Run validation on output BEFORE writing to disk
  validateCSS(minifiedCSS, 'style.min.css');

  fs.writeFileSync(STYLE_MIN, minifiedCSS, 'utf8');
  console.log(`  [SAVED] ${STYLE_MIN}`);

  if (fs.existsSync(SCRIPT_SRC)) {
    const rawJS = fs.readFileSync(SCRIPT_SRC, 'utf8');
    validateJS(rawJS, 'script.js');

    const minifiedJS = minifyJS(rawJS);
    validateJS(minifiedJS, 'script.min.js');
    fs.writeFileSync(SCRIPT_MIN, minifiedJS, 'utf8');
    console.log(`  [SAVED] ${SCRIPT_MIN}`);
  }

  console.log('=== BUILD SUCCESSFUL: All assets safe, valid, and production-ready! ===');
}

function verifyOnly() {
  console.log('=== VERIFYING PRODUCTION ASSETS INTEGRITY ===');
  const css = fs.readFileSync(STYLE_MIN, 'utf8');
  validateCSS(css, 'style.min.css');

  if (fs.existsSync(SCRIPT_MIN)) {
    const js = fs.readFileSync(SCRIPT_MIN, 'utf8');
    validateJS(js, 'script.min.js');
  }
  console.log('=== VERIFICATION PASSED: No corrupted files detected! ===');
}

const args = process.argv.slice(2);
if (args.includes('--verify') || args.includes('--check')) {
  verifyOnly();
} else {
  build();
}
