#!/bin/bash

path="/home/alexycn"

while true; do
    connection_status=$(nmcli g | tail -n +2 | awk '{print $1}')
    if [[ $connection_status == "connected" ]]; then
        rclone copy $path/GDrive-async UMich-GDrive:
        rclone copy UMich-GDrive: $path/GDrive-async
        if [[ $(ls $path/mnt/GDrive) == "" ]]; then
            rclone mount UMich-GDrive: $path/mnt/GDrive &
        fi
    fi
    sleep 300
done
