#!/bin/bash

a_path="/home/alexycn/Cloud-async"
m_path="/home/alexycn/mnt"

arr=("UM" "personal" "business")

while true; do
    for i in "${arr[@]}"
    do
        connection_status=$(nmcli g | tail -n +2 | awk '{print $1}')
        if [[ $connection_status == "connected" ]]; then
        
            rclone copy $a_path/GDrive-$i-async GDrive-UM:
            rclone copy GDrive-UM: $a_path/GDrive-$i-async
            
            if [[ $(ls $path/mnt/GDrive-$i) == "" ]]; then
                rclone mount GDrive-$i: $m_path/GDrive-$i &
            fi
        fi
        sleep 300
    done
done
