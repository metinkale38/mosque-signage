#!/bin/sh
vcgencmd display_power 1 || true
echo 'off 0.0.0.0' | cec-client -s -d 1
