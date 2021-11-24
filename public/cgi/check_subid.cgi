#!/usr/bin/env bash

# Return is always a json
printf "Content-Type: application/json; charset=UTF-8\r\n"
declare formid=$(echo ${QUERY_STRING:1}     | cut -d'?' -f1)
declare checktype=$(echo ${QUERY_STRING:1}  | cut -d'?' -f2)
declare submission_id=$(echo ${QUERY_STRING:1}    | cut -d'?' -f3-1000)
declare edfile=${DATADIR}/${formid}/edits-${formid}.json
status=200

function check_submissionid(){
  edfile="$1"
  subids="${@:2}"
  tmpfile=$(mktemp)
  for s in $subids; do
    cat $edfile | grep $s | sed  -e 's.[[:punct:]]..g' | sed -e 's.\ ..g' >> $tmpfile
  done
  echo $tmpfile
}

if [ "$checktype" == "delete" ]; then
  # make array of ids
  IFS='-' read -r -a subm_ids <<< "${submission_id}"
  tmpfile=$(check_submissionid $edfile ${subm_ids[@]})
  if [[ -e $edfile && -s $tmpfile ]]; then
    status=203
    tr -d '\n' < $tmpfile > ${tmpfile}_n
    cat ${tmpfile}_n | sed 's/^/{"submission_id":[/' | sed 's/$/]}/' > $tmpfile
  fi
elif [ "$checktype" == "edit" ]; then
  declare new_value=$(echo ${submission_id} | cut -d'?' -f3)
  declare col_name=$(echo ${submission_id} | cut -d'?' -f2)
  declare submission_id=$(echo ${submission_id} | cut -d'?' -f1)
  status=$(Rscript --vanilla check_edit.R $edfile $submission_id $col_name $new_value)
else
  stats=505
fi
  
printf "Status: %s \r\n" $status
printf "\r\n" 
cat $tmpfile

# cleanup
rm ${tmpfile} ${tmpfile}_n
