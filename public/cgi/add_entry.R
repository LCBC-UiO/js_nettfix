#!/usr/bin/env Rscript

# grab arguments given by command line
args <- commandArgs(trailingOnly=TRUE)
i <- 1
for(var in c("edfile", "submission_id", "col_name", "value")){
    assign(var, args[i])
    i <- i+1
}

get_datetime <- function(){
    x <- Sys.time()
    x <- as.POSIXlt(x, "UTC")
    format(x, format = "%Y-%m-%dT%H:%M:%S")
}
# create a list entry
entry <- list(column = list(value   = URLdecode(value), 
                            comment = "PLACEHOLDERCOMMENTTEXT",
                            date    = get_datetime()
                            ))
names(entry) <- col_name

# read in the edit file if it exists
if(file.exists(edfile)) ed <- jsonlite::read_json(edfile)
status <- 205
if(exists("ed")){
    status <- 200
    # if the submission id already has other edits, add this one to the list
    if(submission_id %in% names(ed)){
        # grab existin edits for submission id
        dt <- ed[[submission_id]]$data
        # append new edits to old, and rewrite data entry
        ed[[submission_id]]$data <- c(dt, entry)
    }else{
    # else create a new edit entry
        entry <- list(sub = list(data = entry))
        ed <- c(entry, ed)
        names(ed)[1] <- submission_id
    }
}else{
    # if editfile does not exist, then create an entry to make it.
    ed <- list(sub = list(data = entry))
    names(ed)[1] <- submission_id
    status <- 200  
}

# Write the edit file
jsonlite::write_json(ed, edfile, pretty = TRUE, auto_unbox = TRUE)

# Return statuscode to command line
cat(status)
