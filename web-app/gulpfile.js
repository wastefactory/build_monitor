var gulp = require('gulp');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var neat = require('node-neat').includePaths;
var install = require('gulp-install');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var args = require('yargs').argv;
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var ngAnnotate = require('gulp-ng-annotate');
var cleanCSS = require('gulp-clean-css');
var htmlreplace = require('gulp-html-replace');
var sourcemaps = require('gulp-sourcemaps');
var templateCache = require('gulp-angular-templatecache');
var fs = require('fs');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();
var babelify = require('babelify');
var browserify = require('browserify');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var reload = browserSync.reload;
var Server = require('karma').Server;
var gulpProtractorAngular = require('gulp-angular-protractor');

/**
 * Gulp plumber error handler
 * @param err
 */
var onError = function (err) {
    console.log(err);
};

var swallowError = function(err) {
    console.log(err.toString());

    this.emit('end');
};

var paths = {
    sass: [
        './libs/assets/sass/style.scss',
        './libs/vendor/sass/**/*.scss'
    ],
    js: {
        'vendors': [
            './bower_components/angular/angular.js',
            './bower_components/angular-ui-router/release/angular-ui-router.js',
            './bower_components/angular-animate/angular-animate.js',
            './bower_components/angular-messages/angular-messages.js',
            './bower_components/angular-mocks/angular-mocks.js',
            './bower_components/lodash/lodash.js',
            './bower_components/angular-strap/dist/angular-strap.min.js',
            './bower_components/angular-strap/dist/angular-strap.tpl.min.js',
            './bower_components/ng-dialog/js/ngDialog.min.js',
            './bower_components/spin.js/spin.js',
            './bower_components/angular-loading/angular-loading.js',
            './bower_components/angular-loading-bar/build/loading-bar.min.js',
            './bower_components/d3/d3.min.js',
            './bower_components/nvd3/build/nv.d3.min.js',
            './bower_components/angular-nvd3/dist/angular-nvd3.min.js',
            './bower_components/angular-bootstrap/ui-bootstrap.min.js',
            './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            './bower_components/dexie/dist/latest/Dexie.min.js',
            './bower_components/moment/min/moment.min.js',
            './bower_components/kalendae/build/kalendae.standalone.min.js',
            './bower_components/ngstorage/ngStorage.min.js',
            './bower_components/angular-permission/dist/angular-permission.js',
            './bower_components/angular-toastr/dist/angular-toastr.min.js',
            './bower_components/angular-toastr/dist/angular-toastr.tpls.min.js'
        ],
        'nucleus': [
            './libs/assets/template/templates.js',
            './libs/assets/js/nucleus.js'
        ]
    },
    css:{
        'vendors': [
            './bower_components/angular-motion/dist/angular-motion.min.css',
            './bower_components/angular-toastr/dist/angular-toastr.css',
            './bower_components/ng-dialog/css/ngDialog.min.css',
            './bower_components/ng-dialog/css/ngDialog-theme-default.min.css',
            './bower_components/angular-loading-bar/build/loading-bar.min.css',
            './bower_components/nvd3/build/nv.d3.min.css',
            './bower_components/kalendae/build/kalendae.css',
            './bower_components/angular-loading/angular-loading.css',
            './bower_components/angular-toastr/dist/angular-toastr.min.css'
        ],
        'nucleus': [
            './libs/assets/css/*.css',
        ]
    },
    nightly: {
        'app' : './app/**/**/*',
        'static-assets': './static-assets/**/**/*'
    }, 
    buildFolder: './build'
};

gulp.task('install', function () {
   return gulp.src(['./bower.json', './package.json']).pipe(install());
});

gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sass({
            includePaths: ['styles'].concat(neat),
            sourcemap: true
        }))
        .pipe(sourcemaps.write('.', {
            addComment: true
        }))
        .pipe(gulp.dest('./libs/assets/css'))
        .pipe(livereload());
});



/* Prepare all library build tasks */
gulp.task('libraries', ['vendor-js', 'vendor-css'], function(callback) {
    callback();
});

/* Prepare all minfied library build tasks */
gulp.task('libraries-minify', ['minify-vendor-js', 'vendor-css'], function(callback) {
    callback();
});

/* Browserify and transform ES6 javascript files */
gulp.task('browserify', function() {
    return browserify({
            entries: [
                './app/app.module.js',
                './app/app.constants.js',
                './app/app.filters.js',
                './app/app.components.js',
                './app/app.features.js'
            ],
            debug: true
        })
        .on('error', swallowError)
        .transform(babelify)
        .on('error', swallowError)
        .bundle()
        .on('error', swallowError)
        .pipe(source('nucleus.js'))
        .pipe(gulp.dest('./libs/assets/js'));
});

gulp.task('clean', function () {
    return gulp.src(['./libs/assets/template', './libs/js'], {read: false, force: true})
    .pipe(clean());
});

/* Concatenate and uglify library scripts  */
gulp.task('vendor-js', function() {
    // Bundle library scripts
    return gulp.src(paths.js.vendors)
        .pipe(concat('vendor.js'))
        .on('error', swallowError)
        .pipe(gulp.dest('./libs/vendor/js/'));
});

/* Prepare and move css libraries to static assets */
gulp.task('vendor-css', ['minify-vendor-css'], function() {
    // copy bootstrap
    gulp.src('bower_components/bootstrap-sass/assets/stylesheets/_bootstrap.scss', {base: 'bower_components/bootstrap-sass/assets/stylesheets'}).pipe(gulp.dest('libs/vendor/sass'));
    return gulp.src('bower_components/bootstrap-sass/assets/stylesheets/bootstrap/**', {base: 'bower_components/bootstrap-sass/assets/stylesheets/bootstrap'}).pipe(gulp.dest('libs/vendor/sass/bootstrap'));
});

/*
* Concatenate and Minify Vendor CSS Files
*/
gulp.task('minify-vendor-css', function() {
    return gulp.src(paths.css.vendors)
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(concat('vendor.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('libs/vendor/css'));
});

/*
* Minify Nucleus CSS File
*/
gulp.task('minify-css', function() {
    return gulp.src(paths.css.nucleus)
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(concat('nucleus.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('libs/assets/css/'));
});

/*
* Concatenate and Minify Vendor JS Files
*/
gulp.task('minify-vendor-js', function() {
    return gulp.src(paths.js.vendors)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest('libs/vendor/js/'));
});

/*
* Concatenate and Minify Nucleus JS Files
*/
gulp.task('minify-js', function() {
    return gulp.src(paths.js.nucleus)
    .pipe(jshint())
    .pipe(concat('nucleus.min.js'))
    .pipe(ngAnnotate({add: true}))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('libs/assets/js/'));
});

/*
* For Production build it will
* concat js and css dependencies
* obfuscate / uglify js 
* minify css
* create minified index.html
*
* As for Nighlty Build it will
* Copy all CSS and JS files
* and index.html
*/
gulp.task('prepare-build', ['build'], function() {
    // copy index to build folder and rename the js and css src path
    gulp.src('./index.html')
        .pipe(htmlreplace({
            'nucleuscss': 'libs/assets/css/nucleus.min.css',
            'vendorjs': 'libs/vendor/js/vendor.min.js',
            'nucleusjs': 'libs/assets/js/nucleus.min.js',
        }))
        .pipe(gulp.dest('./'));
});

gulp.task("build", function(callback) {
    runSequence('minify-css', 'minify-js', callback);
});

/*
* Clean build folder
*/
gulp.task('clean-build', function () {
    return gulp.src(paths.buildFolder, {read: false, force: true})
    .pipe(clean());
});

/*
* Clean build folder
*/
gulp.task('clean-libs', function () {
    return gulp.src('./libs/vendor', {read: false, force: true})
    .pipe(clean());
});

gulp.task('clean-template', function() {
    return gulp.src('./build/templates.js', {
            read: false,
            force: true
        })
        .pipe(clean());
});

gulp.task('build-template', function() {
    return gulp.src(['./app/features/**/*.html', './app/components/**/*.html'])
        .pipe(templateCache({
            standalone: true,
            root: 'templateCache'
        }))
        .on('error', swallowError)
        .pipe(gulp.dest('./libs/assets/template'));
});

gulp.task("template", function(callback) {
    runSequence('clean-template', 'build-template', callback);
});

gulp.task('karma', ['template'], function() {
    var server = new Server({
        configFile: __dirname + '/test/karma.conf.js'
    }, function() {
        console.log('done');
    });
    server.start();
});

// Setting up the test task
gulp.task('protractor', function(callback) {
    gulp
        .src(['/test/e2e'])
        .pipe(gulpProtractorAngular({
            'configFile': './test/protractor.conf.js',
            'debug': false,
            'autoStartStopServer': true
        }))
        .on('error', function(e) {
            console.log(e);
        })
        .on('end', callback);
});

/* Compiles and generates development build files */
gulp.task("compile", ['clean', 'clean-libs'], function(callback) {
    runSequence('libraries', 'browserify', 'template', 'sass', callback);
});

/* Compiles and generates minified build files for deployment*/
gulp.task("compile-build", ['clean','clean-build', 'clean-libs'], function(callback) {
    runSequence('libraries-minify', 'browserify', 'template', 'sass', 'prepare-build', callback);
});

/* Watch files for any changes and execute compile tasks to build folder */
gulp.task("watch", ['compile'], function() {
    gulp.watch(paths.sass, ['sass']).on('change', reload);
    gulp.watch(['./app/**/*.js'], ['browserify']).on('change', reload);
    gulp.watch(['./app/**/*.html'], ['template']).on('change', reload);
});
