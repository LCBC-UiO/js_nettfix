#!/usr/bin/env bash
printf "Content-Type: application/json; charset=UTF-8\r\n"

i=1
for var in formid submission_id col_name new_value; do 
    declare $var=$(echo ${QUERY_STRING:1}  | cut -d'?' -f$i)
    i=$((i+1))
done

declare edfile=${DATADIR}/${formid}/edits-${formid}.json

status=$(Rscript --vanilla add_entry.R $edfile $submission_id $col_name $new_value)

printf "Status: %s\r\n" $status
printf "\r\n"
cat $edfile
