var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var livereload = require('gulp-livereload');


function compile(watch) {
  var bundler = watchify(browserify('./src/client/linaw.jsx', {
    debug: true
  }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) {
        console.error(err); this.emit('end');
      })
      .pipe(source('linaw.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({
        loadMaps: true
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./public'))
      .pipe(livereload());
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}



function watch() {
  compile(true);
}


gulp.task('build', function() {
  compile();
});
gulp.task('watch', function() {
  livereload.listen();
  watch();
});

gulp.task('default', ['watch']);
