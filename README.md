# Nettfix

## Runnin a localhost server of the application

To prepare the application to run, you will need to download all the necessary components.
```sh
make prepare_offline
```

And then build the necessary tools.
```sh
make build
```

Then run the instance with

```sh
make run_webui
```
The web application will be running on port `3222`.


## Preparing to move into TSD
To move into TSD, its best to start from a clean folder and then prepare for offline work.

```sh
make clean
make prepare_offline
```

Zip the folder and move it into TSD, and place it in the LCBC TULS folder.
From there, build the appliation
```sh
make build
```

And make a tuls service to run the webapplication.
```sh
make run_webui
```
