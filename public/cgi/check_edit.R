#!/usr/bin/env Rscript

args = commandArgs(trailingOnly=TRUE)

i <- 1
for(var in c("edfile", "submission_id", "col_name", "value")){
    assign(var, args[i])
    i <- i+1
}

ed <- jsonlite::read_json(edfile)
status <- 200
if(submission_id %in% names(ed)){
    entry <- ed[[submission_id]]$data
    if(entry == "delete"){
        status <- 403
    }else if(col_name %in% names(entry)){
        status <- 402
    }
}

cat(status)
