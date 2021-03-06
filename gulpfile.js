const gulp = require('gulp'),
      plumber = require('gulp-plumber'),
      browserSync = require('browser-sync'),
      stylus = require('gulp-stylus'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),
      jeet = require('jeet'),
      rupture = require('rupture'),
      koutoSwiss = require('kouto-swiss'),
      prefixer = require('autoprefixer-stylus'),
      imagemin = require('gulp-imagemin'),
      cp = require('child_process');

const messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Monta o site do Jekyll
 */
gulp.task('jekyll-build', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('jekyll', ['build', '--drafts'], { stdio: 'inherit' })
    .on('close', done);
});

/**
 * Refaz o site e atualiza a página
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

/**
 * Espera até que o jekyll-build seja executado e então levanta o
 * servidor utilizando o _site como pasta raiz
 */
gulp.task('browser-sync', ['jekyll-build'], function () {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

/**
 * Javascript Task
 */
gulp.task('js', function () {
  return gulp.src(['src/js/**/*.js', '!src/js/analytics.js'])
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/'));
});

/**
 * Imagemin Task
 */
gulp.task('imagemin', function () {
  return gulp.src('src/img/**/*.{jpg,png,gif}')
    .pipe(plumber())
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest('assets/img/'));
});


gulp.task('watch', function () {
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/img/**/*.{jpg,png,gif}', ['imagemin']);
  gulp.watch(['index.html', '_includes/*.html', '_layouts/*.html', '_posts/*', '_drafts/*'], ['jekyll-rebuild']);
});

// gulp.task('default', ['js', 'stylus', 'imagemin', 'browser-sync', 'watch']);
gulp.task('default', ['js', 'imagemin', 'browser-sync', 'watch']);