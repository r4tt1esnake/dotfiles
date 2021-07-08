#!/usr/bin/env bash

dir="$HOME/.config/rofi/hud"

rofi -theme $dir/hud.rasi -modi blocks -show blocks -blocks-wrap "$dir"/infoDisp.sh -dmenu

