BASEDIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
DOCROOT:=$(BASEDIR)/public 

include config_default.txt
-include config.txt

# ------------------------------------------------------------------------------

# build

PHONY: prepare_offline
prepare_offline:
	make -C 3rdparty download

# ------------------------------------------------------------------------------

# run

.PHONY: run_webui
run_webui: 
	PORT=${WEBSERVERPORT} \
	DOCROOT=${DOCROOT} \
	BASEDIR=$(BASEDIR) \
	DATADIR=${DATADIR} \
	R_LIBS_USER=$(BASEDIR)/3rdparty/r_packages \
	3rdparty/lighttpd/sbin/lighttpd -D -f lighttpd.conf

# ------------------------------------------------------------------------------

# clean

.PHONY: clean
clean: clean
	$(MAKE) -C 3rdparty cclean

# ------------------------------------------------------------------------------

# build

.PHONY: build
build: build
	$(MAKE) -C 3rdparty build
	cp -r 3rdparty/download/bootstrap* ${DOCROOT}