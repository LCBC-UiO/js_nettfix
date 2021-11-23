#!/usr/bin/env bash

# Return is always a json
printf "Content-Type: application/json; charset=UTF-8\r\n"
printf "\r\n"

function urldecode() { : "${*//+/ }"; echo -e "${_//%/\\x}"; }
declare formid=$(echo ${QUERY_STRING:1}  | cut -d'?' -f1)
declare edfile=${DATADIR}/${formid}/edits-${formid}.json
declare comment=$(echo ${QUERY_STRING:1}  | cut -d'?' -f2-1000)
declare commentstr=$(urldecode "$comment")


sed -i -e "s/PLACEHOLDERCOMMENTTEXT/$commentstr/g" $edfile
rm ${edfile}-e
cat $edfile
