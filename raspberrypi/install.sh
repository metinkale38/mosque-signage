#!/bin/bash

echo "NOTICE: This installer test is untested, some commands might be missing or not working, because i configured it manually the first time"

RPI_HOST="${RPI_HOST:raspberrypi}"
NEW_HOSTNAME="${NEW_HOSTNAME:signage}"
CONFIG="${CONFIG:default}"

ssh root@$RPI_HOST <<EOF
  mount -o remount,rw /boot
  crontab < /boot/scripts/crontab
  echo http://127.0.0.1/?$CONFIG > /boot/fullpageos.txt
  mkdir /boot/www || true
  sudo hostname $NEW_HOSTNAME
  sudo raspi-config nonint enable_overlayfs
  /home/pi/scripts/reload_fullpageos_txt
  reboot
EOF