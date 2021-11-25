BASEDIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
DOCROOT:=$(BASEDIR)/public 

include config_default.txt
-include config.txt

# ------------------------------------------------------------------------------

# prepare for TSD

PHONY: prepare_offline
prepare_offline:
	make reset
	make download
	make clean
	cd ../ && zip -FSr $(basename $(notdir $(BASEDIR))).zip $(basename $(notdir $(BASEDIR)))


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

.PHONY: reset
reset: 
	$(MAKE) -C 3rdparty reset

.PHONY: clean
clean: 
	$(MAKE) -C 3rdparty clean

# ------------------------------------------------------------------------------

# build

.PHONY: build
build: 
	$(MAKE) -C 3rdparty build
	
# ------------------------------------------------------------------------------

# download

.PHONY: download
download: 
	$(MAKE) -C 3rdparty download
	