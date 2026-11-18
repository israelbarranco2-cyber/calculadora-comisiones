#!/bin/sh
# Regenera index.html (y app.enc si el acceso está encendido). Ver build.js.
cd "$(dirname "$0")" && node build.js
