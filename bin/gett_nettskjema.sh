#!/bin/bash

BASEDIR="$( cd "$( dirname $0 )/.." && pwd )"
NETTSKJEMA=${BASEDIR}/test-data/ 
FILE=${BASEDIR}/public/forms.json
echo $FILE
echo '{"forms":[null' > $FILE
for f in $(ls $NETTSKJEMA | grep '^[0-9]'); do echo ,${f} >> $FILE; done
echo "]}" >> $FILE
echo "" >> $FILE
