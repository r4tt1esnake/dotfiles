"$HOME"/.config/i3/scripts/rldUI.sh

"$HOME"/.config/picom/launch.sh

launch=(
    "nm-applet" 
    "blueman-applet" 
    "pasystray" 
    "dunst" 
    "unclutter"
    "light-locker"
)

for t in ${launch[@]}; do
    killall -q $t
    while pgrep -u $UID -x $t >/dev/null; do sleep 1; done
    if type $t; then
        $t &
    fi
done
