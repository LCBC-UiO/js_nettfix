modules := $(modules) \
	bootstrap

bssrcs := \
	https://github.com/twbs/bootstrap/releases/download/v5.1.3/bootstrap-5.1.3-dist.zip \
	https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js

bsdsts := $(patsubst %, ./download/%, $(notdir $(bssrcs))) # get only the filename of the URLs

.PHONY: bootstrap_download
bootstrap_download: $(bsdsts)

$(bsdsts): download/%: #to get rid of "download" prefix - no prerequisites
	mkdir -p download
	# fetch correct url by maching the filename
	echo "download" $* "->" $(filter %$*, $(bssrcs)) "->" $@
	wget $(filter %$*, $(bssrcs)) -O $@

.PHONY: bootstrap_clean
bootstrap_clean: 
	$(RM) ../public/bootstrap*
	$(RM) ../public/jquery.min.js 

.PHONY: bootstrap_build
bootstrap_build: 
	unzip -o download/bootstrap-5.1.3-dist.zip -d download/
	cp -v download/bootstrap-5.1.3-dist/js/bootstrap.bundle.min* ../public
	cp -v download/bootstrap-5.1.3-dist/css/bootstrap.min* ../public
	cp -v download/jquery.min.js ../public

