const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const versionJsonPath = path.join(rootDir, 'version.json');
const registroPath = path.join(rootDir, 'REGISTRO_VERSIONES.md');
const indexHtmlPath = path.join(rootDir, 'index.html');

// Arguments: [type: patch|minor|major] [summary] [files]
const args = process.argv.slice(2);
const bumpType = (args[0] && ['patch', 'minor', 'major'].includes(args[0].toLowerCase()))
  ? args[0].toLowerCase()
  : 'patch';

const changeSummary = args[1] || 'Mejoras y optimizaciones generales del sistema.';
const affectedFiles = args[2] || '';

// 1. Read or initialize version.json
let versionData = { version: '5.8.0', lastUpdate: '2026-10-27' };
if (fs.existsSync(versionJsonPath)) {
  try {
    versionData = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
  } catch (err) {
    console.error('Error leyendo version.json:', err);
  }
}

// 2. Calculate new version
const parts = (versionData.version || '5.8.0').replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
while (parts.length < 3) parts.push(0);

if (bumpType === 'major') {
  parts[0] += 1;
  parts[1] = 0;
  parts[2] = 0;
} else if (bumpType === 'minor') {
  parts[1] += 1;
  parts[2] = 0;
} else {
  parts[2] += 1;
}

const newVersion = parts.join('.');
const now = new Date();
const pad = n => String(n).padStart(2, '0');
const todayISO = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const todayES = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;

// 3. Update version.json
versionData.version = newVersion;
versionData.lastUpdate = todayISO;
fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2) + '\n', 'utf8');

// 4. Update index.html
if (fs.existsSync(indexHtmlPath)) {
  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  html = html.replace(
    /<title>(.*?)·\s*v[0-9.]+\s*·\s*[0-9\/.-]+<\/title>/i,
    `<title>$1· v${newVersion} · ${todayES}</title>`
  );
  html = html.replace(
    /<meta name="version" content="[^"]*"\s*\/?>/i,
    `<meta name="version" content="v${newVersion}"/>`
  );
  html = html.replace(
    /<meta name="last-modified" content="[^"]*"\s*\/?>/i,
    `<meta name="last-modified" content="${todayISO}"/>`
  );
  fs.writeFileSync(indexHtmlPath, html, 'utf8');
}

// 5. Update REGISTRO_VERSIONES.md
if (fs.existsSync(registroPath)) {
  let content = fs.readFileSync(registroPath, 'utf8');

  // Update table values
  content = content.replace(
    /(\|\s*\*\*Versión Global del Sistema\*\*\s*\|\s*`)[^`]+(`\s*\|)/g,
    `$1v${newVersion}$2`
  );
  content = content.replace(
    /(\|\s*\*\*Fecha de Última Actualización\*\*\s*\|\s*)[^|]+(\s*\|)/g,
    `$1${todayES} |`
  );

  // Prepare new history entry
  const filesLine = affectedFiles ? `- **Módulos / Archivos afectados**: ${affectedFiles}\n` : '';
  const newEntry = `### [v${newVersion}] - ${todayES}\n${filesLine}- **Tipo de cambio**: ${bumpType.toUpperCase()}\n- **Detalle de cambios**:\n  - ${changeSummary}\n\n`;

  const historyHeaderRegex = /(## 📝 Historial Detallado de Versiones\s*\r?\n)/i;
  if (historyHeaderRegex.test(content)) {
    content = content.replace(historyHeaderRegex, `$1\n${newEntry}`);
  } else {
    content += `\n## 📝 Historial Detallado de Versiones\n\n${newEntry}`;
  }

  fs.writeFileSync(registroPath, content, 'utf8');
}

console.log(`[OK] Versión actualizada automáticamente a v${newVersion} (${todayES})`);
