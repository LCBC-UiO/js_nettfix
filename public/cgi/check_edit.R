#!/usr/bin/env Rscript

args <- commandArgs(trailingOnly=TRUE)
i <- 1
for(var in c("edfile", "submission_id", "col_name", "value")){
    assign(var, args[i])
    i <- i+1
}

status <- 200
if(file.exists(edfile)){
    ed <- jsonlite::read_json(edfile)
    if(submission_id %in% names(ed)){
        entry <- ed[[submission_id]]$data
        if(is.null(entry)){
            status <- 203
        }else if(col_name %in% names(entry)){
            status <- 202
        }
    }
}

cat(status)
