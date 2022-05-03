#!/usr/bin/env Rscript

forms <- list.files(Sys.getenv("DATADIR"))


# Return statuscode to command line
cat(
    "Content-Type: application/json; charset=UTF-8\r",
    sprintf("Status: %s\r", 200),
    "\r",
    jsonlite::toJSON(list("forms" = forms), pretty = TRUE, auto_unbox = TRUE),
    sep = "\n"
)