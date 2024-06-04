#! /usr/bin/env fish
set host_ip (ip addr show | rg 'inet ' | awk 'NR==2 {print $2}')
sudo nmap -sP $host_ip | rg -A 2 'berry'
