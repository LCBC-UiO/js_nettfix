#!/usr/bin/env bash

printf "Content-Type: text/tab-separated-values; charset=UTF-8\r\n"
printf "\r\n"

cat ${DATADIR}/${QUERY_STRING:1}/form-${QUERY_STRING:1}.csv
