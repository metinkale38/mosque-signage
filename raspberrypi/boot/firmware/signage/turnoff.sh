#!/bin/sh
vcgencmd display_power 0 || true
echo 'off 0.0.0.0' | cec-client -s -d 1
