#!/usr/bin/env bash

# Return is always a json
printf "Content-Type: application/json; charset=UTF-8\r\n"

declare formid=$(echo ${QUERY_STRING:1}  | cut -d'?' -f1)
declare edfile=${DATADIR}/${formid}/edits-${formid}.json
declare submission_id=$(echo ${QUERY_STRING:1}  | cut -d'?' -f2-1000)

# Add new content to tmpfile
declare tmpfile=$(mktemp)
IFS='-' read -r -a subm_ids <<< "${submission_id}"
for (( i=0; i<${#subm_ids[@]}; i++ )); do
  if [ $i -ne  0 ]; then printf ',\n'; fi >> $tmpfile
printf '  "%s": { 
    "data"   : "delete",
    "comment": "PLACEHOLDERCOMMENTTEXT",
    "date"   : "%s"
  }' ${subm_ids[$i]} $(date +%Y-%m-%dT%T ) >> $tmpfile
done

# TODO: detect existing edit file
#       - check if submission id already edited
#       - give error if exists already, show edited entry
#       - add to file if no error
if [ -e $edfile ]; then
  declare tmpfile2=$(mktemp)
  touch $tmpfile2
  for (( i=0; i<${#subm_ids[@]}; i++ )); do
    if [ $i -ne  0 ]; then printf ','; fi >> $tmpfile2
    cat $edfile | grep ${subm_ids[$i]} | sed -e s.[[:punct:]]..g | sed -e s.\ ..g >> $tmpfile2
  done
  if [ -s $tmpfile2 ]; then 
    printf "Status: 210 Entry exists\r\n" 
    printf "\r\n" 
    tr -d '\n' < $tmpfile2 > ${tmpfile2}_n
    cat ${tmpfile2}_n | sed 's/^/{"submission_id":[/' | sed 's/$/]}/'
  else
    printf "Status: 200 Added entry\r\n" 
    printf "\r\n"
    cp $edfile $tmpfile2

    printf "{\n" > $edfile
    cat $tmpfile >> $edfile
    printf "," >> $edfile
    cat $tmpfile2  | sed 's/^{//' >> $edfile
    cat $edfile
  fi
else
  printf "Status: 200 Created edits\r\n" 
  printf "\r\n" 
  # create new file
  printf '{\n' > $edfile
  cat $tmpfile >> $edfile
  printf '\n}\n' >> $edfile
  cat $edfile
fi

# cleanup 
rm $tmpfile $tmpfile2
