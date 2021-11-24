#!/usr/bin/env Rscript

args <- commandArgs(trailingOnly=TRUE)
i <- 1
for(var in c("edfile", "submission_id")){
    assign(var, args[i])
    i <- i+1
}

ed <- jsonlite::read_json(edfile)
submission_id <- strsplit(submission_id, "\\?")[[1]]
entry <- lapply(submission_id, function(x) ed[x])

cat(
    jsonlite::toJSON(
        entry, 
        pretty = TRUE, 
        auto_unbox = TRUE
    )
)
