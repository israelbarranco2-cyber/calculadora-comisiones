// Genera index.html (y app.enc cuando el control de acceso está encendido) a partir de
// "Calculadora de Comisiones.html", la misma que está en Claude.
// Con ACCESS_URL puesta, la calculadora (el script data-core) se publica cifrada:
// solo la abre quien recibe la llave del servidor (clave vigente).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const dir = __dirname;
const src = fs.readFileSync(path.join(dir, '..', 'Calculadora de Comisiones.html'), 'utf8');
const url = (src.match(/const ACCESS_URL = '([^']*)'/) || [])[1] || '';
const enc = path.join(dir, 'app.enc');
let body = src;
if (url) {
  const m = src.match(/<script data-core>\r?\n([\s\S]*?)<\/script>\r?\n?/);
  if (!m) throw new Error('No encontré el script data-core');
  body = src.replace(m[0], '');
  const key = Buffer.from(fs.readFileSync(path.join(dir, '..', 'acceso-servidor', 'clave-app.txt'), 'utf8').trim(), 'base64');
  if (key.length !== 32) throw new Error('clave-app.txt debe tener 32 bytes en base64');
  const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', key, iv);
  const out = Buffer.concat([iv, c.update(m[1], 'utf8'), c.final(), c.getAuthTag()]);
  fs.writeFileSync(enc, out);
  console.log('Acceso encendido: calculadora cifrada en app.enc (' + out.length + ' bytes)');
} else {
  if (fs.existsSync(enc)) fs.unlinkSync(enc);
  console.log('Acceso apagado: calculadora completa en index.html');
}
const head = `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="icon-512.png">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<style>body{margin:0}</style>
</head>
<body>
`;
const tail = `<script>if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js');</script>
</body>
</html>
`;
fs.writeFileSync(path.join(dir, 'index.html'), head + body + tail);
