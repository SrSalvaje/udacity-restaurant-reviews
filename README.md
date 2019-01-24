# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 1

For the **Restaurant Reviews** projects I had to convert a static webpage to a mobile-ready web application by  adding accessibility features, converting the design to be responsive on different sized displays and  add a service worker to allow offline use.

## my dependencies:

 #Build tools:
Node v10.8.0 or higher, Gulp: CLI version 2.0.1, Local version 4.0.0, browser-sync, npm http-server, Gulp-sass, gulp-autoprefixer., gulp-concat, gulp-babel, gulp-uglify, gulp-sourcemaps, gulp-imagemin, leaflet.js, mapbox.
 
 #Running the app
To run the project you either need to launch a python server or install node, gulp, browsersync and npm http server, then launch browsersync from the command line with "$ gulp browserSync" and go to http://localhost:8000/, if that port is already in use check the output for the console and visit the port used by browsersync.

* Note - If you need to use a port that is not 8000 you need to update line 11 of dbhelper.js to match the port you are using.

For Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`.

 For Windows systems, Python 3.x is installed as `python` by default. To start a Python 3.x server, you can simply enter `python -m http.server 8000`.

 * Note - I still plan to make changes prior to adding to my portfolio so make sure you use the app folder as the base directory and not the dist folder.
 
