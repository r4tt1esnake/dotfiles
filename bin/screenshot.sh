output="$HOME/Pictures/screenshots"

ls "$output" > /dev/null

if [[ $? != 0 ]]; then
    mkdir -p "$output"
fi

filename="$output/$(date +"%Y-%m-%d_%H.%M.%S")"

command="maim -f png -u -m 10"

clip="xclip -sel c -t image/png"

if [[ $1 == "area" ]]; then
    $command -s -b 3 -p 0 -D "$filename" | $clip
elif [[ $1 == "window" ]]; then
    $command -i $(xdotool getactivewindow) "$filename" | $clip
else
    $command "$filename" | $clipS
fi

