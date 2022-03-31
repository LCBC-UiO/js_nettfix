#!/usr/bin/env Rscript

get_datetime <- function(){
    x <- Sys.time()
    x <- as.POSIXlt(x, "UTC")
    format(x, format = "%Y-%m-%dT%H:%M:%S")
}

get_params <- function(){
    qstring <- Sys.getenv("QUERY_STRING")
    qstring <- gsub("^\\=", "", qstring)
    qstring <- strsplit(qstring, "\\?")[[1]]
    qstring <- strsplit(qstring, "=")
    ret <- sapply(qstring, function(x) x[2])
    names(ret) <- sapply(qstring, function(x) x[1])
    na.idx = which(is.na(ret))
    ret[na.idx] <- names(ret[na.idx])
    as.list(ret)
}
params <- get_params()
names(params)  <- c("formid", "submission_id", "col_name", "value", "comment")

# create a list entry
entry <- list(column = list(value   = URLdecode(params$value), 
                            comment = URLdecode(params$comment),
                            date    = get_datetime()
                            ))
names(entry) <- params$col_name

# read in the edit file if it exists
edfile <- sprintf("%s/%s/edits-%s.json",
                  Sys.getenv("DATADIR"), params$formid, params$formid)
if(file.exists(edfile)) ed <- jsonlite::read_json(edfile)
status <- 205
if(exists("ed")){
    status <- 200
    # if the submission id already has other edits
    if(params$submission_id %in% names(ed)){
        # grab existing edits for submission id
        dt <- ed[[params$submission_id]]$data
        # if data exists, delete (for overriding)
        if(params$col_name %in% names(dt)){
            # add old data to "log" element
            if("log" %in% names(dt[[params$col_name]])){
                log_idx <- which(names(dt[[params$col_name]]) %in% "log")
                log <- dt[[params$col_name]][[log_idx]]
                tmp <- dt[[params$col_name]][log_idx*-1]
                log <- list(c(list(tmp), log))
                print(log)
            }else{
                log <- list(list(dt[[params$col_name]]))
            }
            new_entry <- c(entry[[params$col_name]], log = log)
            entry <- list(new_entry)
            names(entry) <- params$col_name
            dt[[params$col_name]] <- NULL
        }
        # append new edits to old, and rewrite data entry
        ed[[params$submission_id]]$data <- c(dt, entry)
    }else{
    # else create a new edit entry
        entry <- list(sub = list(data = entry))
        ed <- c(entry, ed)
        names(ed)[1] <- params$submission_id
    }
}else{
    # if editfile does not exist, then create an entry to make it.
    ed <- list(sub = list(data = entry))
    names(ed)[1] <- params$submission_id
    status <- 200  
}

# Write the edit file
jsonlite::write_json(ed, edfile, pretty = TRUE, auto_unbox = TRUE)

# Return statuscode to command line
cat(
    "Content-Type: text/plain; charset=UTF-8\r",
    sprintf("Status: %s\r", status),
    "\r",
    jsonlite::toJSON(ed[params$submission_id], pretty = TRUE, auto_unbox = TRUE),
    sep = "\n"
)
