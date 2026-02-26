#!/bin/bash

# ensure root ssh is active

RPI_HOST=$1

ssh root@$RPI_HOST apt update
ssh root@$RPI_HOST apt-get install --no-install-recommends cage chromium libwayland-client0 libgbm1 --yes
ssh root@$RPI_HOST mount -o remount,rw /boot/firmware
ssh root@$RPI_HOST adduser signage
ssh root@$RPI_HOST usermod -aG video,input,audio,render signage
rsync -rv --exclude=install.sh ./* root@$RPI_HOST:/
ssh root@$RPI_HOST chmod +x /boot/firmware/signage/*.sh
ssh root@$RPI_HOST "crontab < /boot/firmware/signage/crontab"
ssh root@$RPI_HOST raspi-config nonint do_overlayfs 0
ssh root@$RPI_HOST reboot