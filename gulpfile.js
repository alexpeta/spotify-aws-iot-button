var gulp = require('gulp');
var bump = require('gulp-bump');
var semver = require('semver');

gulp.task('bump', function(){
    return new Promise(function(resolve, reject) {
        gulp.src('./package.json')
        .pipe(bump({key: "version"}))
        .pipe(gulp.dest('./'))
        resolve();
    });
});