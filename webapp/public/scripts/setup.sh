#!/bin/bash
crontab < crontab

mount -o remount,rw /boot
echo http://$(hostname -f)/ > /boot/fullpageos.txt
mkdir /boot/www || true

sed -e '/server.document-root/ s/^#*/#/' -i /etc/lighttpd/lighttpd.conf
echo "server.document-root        = \"/boot/www/\"" >> /etc/lighttpd/lighttpd.conf
echo "rm -rf /home/pi/.cache/chromium/" >> /home/pi/scripts/reload_fullpageos_txt

# add --autoplay-policy=no-user-gesture-required to chromium cmdline

reboot