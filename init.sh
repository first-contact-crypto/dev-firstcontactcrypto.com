#!/bin/bash

npm init

npm install --save-dev gulp 

npm audit fix

npm install --save-dev gulp-sass gulp-autoprefixer gulp-cssmin browser-sync gulp-concat \
                       gulp-minify gulp-rename gulp-imagemin

gulp mdb-go
