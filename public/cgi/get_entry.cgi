#!/usr/bin/env Rscript

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
names(params)  <- c("formid", "submission_id")

edfile <- sprintf("%s/%s/edits-%s.json",
                  Sys.getenv("DATADIR"), params$formid, params$formid)
ed <- jsonlite::read_json(edfile)
submission_id <- strsplit(params$submission_id, "\\?")[[1]]
entry <- lapply(submission_id, function(x) ed[x])

# Return statuscode to command line
cat(
    "Content-Type: text/plain; charset=UTF-8\r",
    sprintf("Status: %s\r", 200),
    "\r",
    jsonlite::toJSON(ed[params$submission_id], pretty = TRUE, auto_unbox = TRUE),
    sep = "\n"
)

