if [[ $(acpi | grep -e "Discharging" -c) == 0 ]]; then
    "$HOME"/bin/toggle-kb-illum.sh on
else
    "$HOME"/bin/toggle-kb-illum.sh off
fi

