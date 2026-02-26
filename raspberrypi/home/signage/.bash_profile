if [[ -z $DISPLAY ]] && [[ $(tty) == /dev/tty1 ]]; then
    LOG_FILE="/home/signage/cage.log"
    exec &>> "$LOG_FILE"
    exec cage -s "/boot/firmware/signage/start.sh"
fi