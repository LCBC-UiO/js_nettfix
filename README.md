# Nettfix

This little application should enable users to make small edits to incoming nettskjema data.
These edits are stored in json files along side the original data on the local file system. 

## Runnin a localhost server of the application

To prepare the application to run, you will need to download all the necessary components.
```sh
make download
```

And then build the necessary tools.
```sh
make build
```

Then run the instance with

```sh
make run_webui
```

The web application will by default be running on port `3222`, using the test data in the [data](data/) folder.


## Preparing to move into TSD
To move into TSD, its best to start from a clean folder and then prepare for offline work.

```sh
make prepare_offline
```

The necessary files will be downloaded again, the application built, and then downloaded files will be deleted to reduce the size of the content. 
The entire folder will be zipped for easy move to TSD, and be located in the folder above the working directory, with the basename of the working directory as the zip file name.
Usually this will ne `js_nettfix.zip`, unless the folder has been renamed on git clone.

Upload the zip file into TSD, and make a tuls service to run the webapplication.

```sh
make run_webui
```
