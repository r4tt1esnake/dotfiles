if [[ $1 == "area" ]]; then
    scrot -s 'screenshot_%Y%m%d_%H%M%S.png' -q 100 -e 'mkdir -p ~/Pictures/screenshots && mv $f ~/Pictures/screenshots && xclip -selection clipboard -t image/png -i ~/Pictures/screenshots/`ls -1 -t ~/Pictures/screenshots | head -1`'
elif [[ $1 == "window" ]]; then
    scrot -u 'screenshot_%Y%m%d_%H%M%S.png' -q 100 -e 'mkdir -p ~/Pictures/screenshots && mv $f ~/Pictures/screenshots && xclip -selection clipboard -t image/png -i ~/Pictures/screenshots/`ls -1 -t ~/Pictures/screenshots | head -1`'
else
    scrot 'screenshot_%Y%m%d_%H%M%S.png' -q 100 -e 'mkdir -p ~/Pictures/screenshots && mv $f ~/Pictures/screenshots && xclip -selection clipboard -t image/png -i ~/Pictures/screenshots/`ls -1 -t ~/Pictures/screenshots | head -1`'
fi

notify-send -c "sys-alert" -i "/usr/share/icons/Vimix-Doder-dark/symbolic/devices/camera-photo-symbolic.svg" "Screenshot" "if possible, image will be saved to\n~/Pictures/screenshots"
