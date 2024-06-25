#! /usr/bin/env fish

# A script to find the ip address of the rasberry pi.
set host_ip (ip addr show | rg 'inet ' | awk 'NR==2 {print $2}')

sudo nmap -sP $host_ip | rg -B 2 'berry'
