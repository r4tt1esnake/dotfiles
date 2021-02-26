#!/usr/bin/env bash

# Only exported variables can be used within the timer's command.
export PRIMARY_DISPLAY="$(xrandr | awk '/ primary/{print $1}')"

# Run xidlehook
xidlehook \
  --not-when-fullscreen \
  --not-when-audio \
  --timer 540 \
    'xrandr --output "$PRIMARY_DISPLAY" --brightness .1' \
    'xrandr --output "$PRIMARY_DISPLAY" --brightness 1' \
  --timer 600 \
    'xrandr --output "$PRIMARY_DISPLAY" --brightness 1' \ 
    'loginctl lock-session' \
  --timer 1200 \
    'systemctl suspend' \
  --timer 6000 \
    'systemctl hibernate' \
