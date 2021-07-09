#!/usr/bin/env bash

dir="$HOME/.config/rofi/hud"

toggleMarkup="true"
while printf ''; do
    cpuTemp=$(getTemps)
	cpuUse=$(usedcpu | cut -d'%' -f1)
	ramUse=$(usedram)
	br=$(brightness | cut -d'%' -f1 | cut -c 5-)
	br_icon=$(brightness | cut -c -3)
	vol=$(volume | cut -d'%' -f1 | cut -c 5-)
	vol_icon=$(volume | cut -c -3)
	buds=$(galaxyBuds)
	buds1=$(echo "$buds" | cut -d'%' -f1)
	buds2=$(echo "$buds" | cut -d'%' -f2)
	buds3=$(echo "$buds" | cut -d'%' -f3)
	if [[ $buds == "" ]]; then
	    cond=""
	else
	    cond="%%"
	fi
    TEXT=$(cat <<EOF | sed 's/\\/\\\\/g' | tr -d "\n" | tr -d "\t"
{
	"prompt": "Logged in as $USER on $HOSTNAME",
	"lines":[
        {"text":"<u>CPU</u>\t\t\t<b>$cpuTemp\t\t$cpuUse%%</b>", "markup": true},
		{"text":"<u>RAM</u>\t\t\t<b>$ramUse</b>", "markup": true},
		{"text":"<u>Brightness</u>\t$br_icon\t<b>$br%%</b>", "markup": true},
		{"text":"<u>Volume</u>\t\t$vol_icon\t<b>$vol%%</b>", "markup": true},
		{"text":"<u>Buds Charge</u>\t\t<b>$buds1$cond$buds2$cond$buds3</b>", "markup": true}
	]}
EOF
)

	if ! printf "$TEXT\n"; then
		exit 1;
	fi
 	sleep 1;
 	if [ "$toggleMarkup" = "true" ]; then toggleMarkup="false"; else toggleMarkup="true"; fi

done | rofi -theme $dir/hud.rasi -modi blocks -show blocks -blocks-wrap "$@"

