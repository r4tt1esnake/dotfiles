if [ $# -ge 1 ]; then
    dispNum=$1
else
    dispNum=$(xrandr | grep " connected" -c)
fi

if [ $dispNum -gt 1 ]; then
    xrdb "$HOME"/.Xresources-ext
else
    xrdb "$HOME"/.Xresources
fi
