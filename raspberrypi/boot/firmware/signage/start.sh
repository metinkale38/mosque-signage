#!/bin/sh

CONFIG_FILE="/boot/firmware/signage/config"
URL_BASE="http://127.0.0.1:8000/index.html"

config=""
[ -r "$CONFIG_FILE" ] && config="$(cat "$CONFIG_FILE")"

chromium --ozone-platform=wayland \
          --kiosk \
          --no-first-run \
          --disable-translate \
          --disable-features=Translate \
          --incognito \
          --disable-infobars \
          --no-sandbox \
          --disable-sync \
          --use-gl=egl \
          --use-angle=gles \
          --disable-features=MediaRouter \
          --no-memcheck \
          --start-fullscreen \
          --autoplay-policy=no-user-gesture-required \
          --enable-features=VaapiVideoDecoder \
          "http://127.0.0.1:8000/index.html?$config" >> "/home/signage/chromium.log"