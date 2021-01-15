if [ $# -ge 1 ]; then
    dispNum=$1
else
    dispNum=$(xrandr --listactivemonitors | grep "Monitors:" | cut -d" " -f2)
fi

if [ $dispNum -gt 1 ]; then
    xrdb "$HOME"/.Xresources-ext
else
    xrdb "$HOME"/.Xresources
fi
