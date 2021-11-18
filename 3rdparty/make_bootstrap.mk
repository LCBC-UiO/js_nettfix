modules := $(modules) \
	bootstrap

bssrcs := \
	https://github.com/twbs/bootstrap/releases/download/v5.1.3/bootstrap-5.1.3-dist.zip \
	https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js

.PHONY: bootstrap_download
bootstrap_download: 
	mkdir -p download/
	for bs in $(bssrcs) ; do \
		if [ ! -f download/$$bs ]; then \
			wget --directory-prefix=download $$bs ; \
		fi \
	done

.PHONY: bootstrap_clean
bootstrap_clean: 
	rm -r ../public/bootstrap-5.1.3-dist
	rm -r download/bootstrap*

.PHONY: bootstrap_build
bootstrap_build: 
	unzip  download/bootstrap-5.1.3-dist.zip -d ../public/
	cp download/jquery.min.js ../public/
