modules := $(modules) \
	bootstrap

bsversion := 5.1.3

bssrcs := \
	https://github.com/twbs/bootstrap/releases/download/v${bsversion}/bootstrap-${bsversion}-dist.zip \
	https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js

bsdsts := $(patsubst %, ./download/%, $(notdir $(bssrcs))) # get only the filename of the URLs

.PHONY: bootstrap_download
bootstrap_download: $(bsdsts)
	unzip -o download/bootstrap-${bsversion}-dist.zip -d download/
	cp -v download/bootstrap-${bsversion}-dist/js/bootstrap.bundle.min* download/
	cp -v download/bootstrap-${bsversion}-dist/css/bootstrap.min* download/
	$(RM) -r download/bootstrap-${bsversion}-dist*


$(bsdsts): download/%: #to get rid of "download" prefix - no prerequisites
	mkdir -p download
	# fetch correct url by maching the filename
	echo "download" $* "->" $(filter %$*, $(bssrcs)) "->" $@
	wget $(filter %$*, $(bssrcs)) -O $@

.PHONY: bootstrap_clean
bootstrap_clean: 
	$(RM) ../public/bootstrap*
	$(RM) ../public/jquery.min.js 

.PHONY: bootstrap_reset
bootstrap_reset: 
	$(RM) -r download/bootstrap*
	$(RM) -r bootstrap*
	$(RM) download/jquery.min.js 
	$(MAKE) bootstrap_clean

.PHONY: bootstrap_build
bootstrap_build: 
	mkdir -p ../public/bootstrap 
	cp -v download/bootstrap.bundle.min* ../public/bootstrap 
	cp -v download/bootstrap.min* ../public/bootstrap 
	cp -v download/jquery.min.js ../public/js/ 

