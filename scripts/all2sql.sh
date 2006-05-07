#!/bin/sh

FG_ROOT=

if [ -n "$1" ]; then
    FG_ROOT="$1"
fi

if [ -z "${FG_ROOT}" ]; then
    echo "Please set FG_ROOT or pass a FG_ROOT path"
    exit -1
fi

if [ ! -d "${FG_ROOT}" ]; then
    echo "${FG_ROOT} is not a directory."
    exit -1
fi

APT=${FG_ROOT}/Airports/apt.dat.gz
NAV=${FG_ROOT}/Navaids/nav.dat.gz
FIX=${FG_ROOT}/Navaids/fix.dat.gz
AWY=${FG_ROOT}/Navaids/awy.dat.gz

if [ ! -f ${APT} ]; then
    echo "${APT} doesn't exist."
    exit -1
fi

if [ ! -f ${NAV} ]; then
    echo "${NAV} doesn't exist."
    exit -1
fi

if [ ! -f ${FIX} ]; then
    echo "${FIX} doesn't exist."
    exit -1
fi

if [ ! -f ${AWY} ]; then
    echo "${AWY} doesn't exist."
    exit -1
fi


zcat ${APT} | ./apt2sql > ++apt.sql
zcat ${NAV} | ./nav2sql > ++nav.sql
zcat ${FIX} | ./fix2sql > ++fix.sql
zcat ${AWY} | ./awy2sql > ++awy.sql


