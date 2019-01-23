const gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"), //not supported by source maps
    browserSync = require("browser-sync").create(), //do i need to remove it from sass?
    concat= require("gulp-concat"),
    babel = require("gulp-babel"),
    uglify = require("gulp-uglify"),
    sourcemaps = require("gulp-sourcemaps"),
    jasmineBrowser = require("gulp-jasmine-browser"),
    imagemin = require("gulp-imagemin"),
    pngquant = require('imagemin');

//sass and prefixer; launched with sync command
gulp.task("sass", function(done) {
    gulp.watch("app/scss/**/*.scss", browserSync.reload());
    gulp.src("app/scss/**/*.scss")
        .pipe(sass({outputStyle: "expanded"} ).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["last 2 versions"]
        }))
        .pipe(gulp.dest("app/css"));
    done();
});

//watchers

gulp.task("watch:scss", function(){
    gulp.watch("app/scss/**/*.scss", gulp.series("sass")); 
});

gulp.task("watch:html", function(){
    gulp.watch("app/*.html", gulp.series("htmlw"/* , 'copy-html' */)); 
});
gulp.task("htmlw", function(done){
    gulp.watch("app/*.html", browserSync.reload());
    done();
});


gulp.task("watch:js", function(){
    gulp.watch("app/js/**/*.js", gulp.series("jsw"));
  
});

gulp.task("jsw", function(done){
    gulp.watch("app/js/**/*.js", browserSync.reload());
    done(); 
});




gulp.task("watch", gulp.parallel("watch:scss", "watch:html", "watch:js"));

//browser sync, launched with sync
gulp.task("browserSync", function(done) {
    browserSync.init({
        port: 8000,
        server: {baseDir: "./app",   
        }
        
    });
    done();
});
//sync task
gulp.task("sync",
    gulp.parallel( "browserSync", gulp.parallel("watch"))
);

//copy html and images
gulp.task("copy-html", function(done){
    gulp.src("app/*.html")
        .pipe(gulp.dest("dist"));
    done();
});

gulp.task("copy-images", function(done){
    gulp.src("app/img/*")
        .pipe(gulp.dest("dist/img"));
    done();
});

gulp.task("copy-css", function(done){
    gulp.src("app/css/*")
        .pipe(gulp.dest("dist/css"));
    done();
});



//js concantenation, transpiling and minification
gulp.task("scripts", function(){
    gulp.src("app/js/**/*.js")
        .pipe(babel({
            presets: ["env"]
        }))
        .pipe(concat("all.js"))
        .pipe(gulp.dest("app/js"));
});

gulp.task("scripts-dist", function(done){
    gulp.src("app/js/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["env"]
        }))
        .pipe(concat("all.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/js"));
    done();
});

//production task
gulp.task("dist", gulp.series("copy-html", "copy-images", "copy-css",/* 'sass', */ "scripts-dist"));
//jasmin
gulp.task("tests", function() {
    gulp.src("tests/spec/extraSpec.js")
        .pipe(jasmineBrowser.specRunner())
        .pipe(jasmineBrowser.server({port:3001}));
});

//imagemin
gulp.task("default", function() {
    return gulp.src("app/img/*")
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest("dist/img"));
});