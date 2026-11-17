#!/bin/sh
# Regenera index.html a partir de "Calculadora de Comisiones.html" (la misma que está en Claude).
cd "$(dirname "$0")"
{
cat <<'HEAD'
<!doctype html>
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
HEAD
cat "../Calculadora de Comisiones.html"
cat <<'TAIL'
<script>if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js');</script>
</body>
</html>
TAIL
} > index.html
