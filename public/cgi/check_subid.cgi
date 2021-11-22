#!/usr/bin/env bash
source utils.sh

# Return is always a json
printf "Content-Type: application/json; charset=UTF-8\r\n"
printf "\r\n" 

declare formid=$(echo ${QUERY_STRING:1}     | cut -d'?' -f1)
declare checktype=$(echo ${QUERY_STRING:1}  | cut -d'?' -f2)
declare submission_id=$(echo ${QUERY_STRING:1}    | cut -d'?' -f3-1000)
declare edfile=${DATADIR}/${formid}/edits-${formid}.json
status=405

# make array of ids
IFS='-' read -r -a subm_ids <<< "${submission_id}"
if [ "$checktype" == "delete" ]; then
  tmpfile=$(check_submissionid $edfile ${subm_ids[@]})
  if [[ -e $edfile && -s $tmpfile ]]; then
    status=403
    tr -d '\n' < $tmpfile > ${tmpfile}_n
    cat ${tmpfile}_n | sed 's/^/{"submission_id":[/' | sed 's/$/]}/' > $tmpfile
  else
    status=200
  fi
elif [ "$checktype" == "edit" ]; then
  declare new_value=$(echo ${submission_id} | cut -d'?' -f3)
  declare col_name=$(echo ${submission_id} | cut -d'?' -f2)
  declare submission_id=$(echo ${submission_id} | cut -d'?' -f1)
  echo $edfile $submission_id $col_name $new_value
  status=$(Rscript --vanilla check_edit.R $edfile $submission_id $col_name $new_value)
fi
  
#printf "Status: %s \r\n" $status
#printf "\r\n" 
echo $status
cat $tmpfile

# cleanup
rm ${tmpfile}*
