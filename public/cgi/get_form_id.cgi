#!/usr/bin/env bash

printf "Content-Type: application/json; charset=UTF-8\r\n"
printf "\r\n"

printf '{\n\t"forms": ["NULL"'
for formid in $(ls $DATADIR); do
    printf ',\n\t\t"%s"' $formid
done 
printf ']\n}'
