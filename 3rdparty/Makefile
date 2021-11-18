BASEDIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

.PHONY: _all
_add: all

modules := 

include make_lighttpd.mk
include make_rpkgs.mk
include make_bootstrap.mk

all: $(addsuffix _build, $(modules))

.PHONY: download
download: $(addsuffix _download, $(modules))

.PHONY: cclean
cclean: $(addsuffix _clean, $(modules))
	rm -r download

.PHONY: build
build: $(addsuffix _build, $(modules))

