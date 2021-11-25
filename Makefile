BASEDIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
DOCROOT:=$(BASEDIR)/public 

include config_default.txt
-include config.txt

# ------------------------------------------------------------------------------

# prepare for TSD

PHONY: prepare_offline
prepare_offline:
	make clean
	make download
	make build
	make clean_dl
	cd ../ && zip -FSr $(BASEDIR).zip $(BASEDIR)

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

.PHONY: clean_dl
clean_dl: clean_dl
	$(RM) -r 3rdparty/download


.PHONY: clean
clean: clean
	$(MAKE) -C 3rdparty clean
	make clean_dl

# ------------------------------------------------------------------------------

# build

.PHONY: build
build: build
	$(MAKE) -C 3rdparty build
	
# ------------------------------------------------------------------------------

# download

.PHONY: download
download: download
	$(MAKE) -C 3rdparty download
	