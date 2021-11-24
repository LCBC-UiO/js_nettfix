#!/usr/bin/env Rscript

args <- commandArgs(trailingOnly=TRUE)

i <- 1
for(var in c("edfile", "submission_id", "col_name", "value")){
    assign(var, args[i])
    i <- i+1
}

entry <- list(column = list(value = value, comment = "PLACEHOLDERCOMMENTTEXT"))
names(entry) <- col_name

if(file.exists(edfile)) ed <- jsonlite::read_json(edfile)
status <- 205
if(exists("ed")){
    if(submission_id %in% names(ed)){
        dt <- ed[[submission_id]]$data
        dt <- c(dt, entry)
        ed[[submission_id]]$data <- dt
        status <- 200
    }else{
        entry <- list(sub = list(data = entry))
        ed <- c(entry, ed)
        names(ed)[1] <- submission_id
        status <- 200
    }
}else{
    ed <- list(sub = list(data = entry))
    names(ed)[1] <- submission_id
    status <- 200  
}

jsonlite::write_json(ed, edfile, pretty = TRUE, auto_unbox = TRUE)
cat(status)
