#!/usr/bin/env bash

# Return is always a json
printf "Content-Type: application/json; charset=UTF-8\r\n"
printf "\r\n" 

declare formid=$(echo ${QUERY_STRING:1}     | cut -d'?' -f1)
declare submission_id=$(echo ${QUERY_STRING:1}  | cut -d'?' -f2-1000)
declare edfile=${DATADIR}/${formid}/edits-${formid}.json

Rscript --vanilla get_entry.R $edfile $submission_id

