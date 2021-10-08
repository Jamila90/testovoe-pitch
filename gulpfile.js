"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgSprite = require("gulp-svg-sprite");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const del = require("del");
const pug = require("gulp-pug");
// const puglint = require('gulp-pug-lint');

gulp.task("css", function () {
	return gulp
		.src("src/sass/style.scss")
		.pipe(plumber())
		.pipe(sourcemap.init())
		.pipe(sass())
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest("build/css"))
		.pipe(csso())
		.pipe(rename("style.min.css"))
		.pipe(sourcemap.write("."))
		.pipe(gulp.dest("build/css"))
		.pipe(server.stream());
});

gulp.task("server", function () {
	server.init({
		server: "build/",
		notify: false,
		open: true,
		cors: true,
		ui: false,
	});

	gulp.watch("src/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
	gulp.watch("src/img/icon-*.svg", gulp.series("sprite", "pug", "refresh"));
	gulp.watch("src/**/*.pug", gulp.series("pug", "refresh"));
	gulp.watch("src/js/*.js", gulp.series("copy", "refresh"));
});

gulp.task("refresh", function (done) {
	server.reload();
	done();
});

gulp.task("images", function () {
	return gulp
		.src("src/img/**/*.{png,jpg,svg}")
		.pipe(
			imagemin([
				imagemin.optipng({ optimizationLevel: 3 }),
				imagemin.jpegtran({ progressive: true }),
				imagemin.svgo(),
			])
		)

		.pipe(gulp.dest("src/img"));
});

gulp.task("webp", function () {
	return gulp
		.src("src/img/**/*.{png,jpg}")
		.pipe(webp({ quality: 90 }))
		.pipe(gulp.dest("src/img"));
});

gulp.task("sprite", function () {
	return gulp
		.src("src/img/icon-*.svg")
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: "../sprite.svg",
					},
				},
			})
		)
		.pipe(gulp.dest("build/img/"));
});

gulp.task("pug", function () {
	return gulp
		.src("src/*.pug")
		.pipe(plumber())
		.pipe(posthtml([include()]))
		.pipe(pug({ pretty: true}))
		.pipe(gulp.dest("build"));
});

gulp.task("copy", function () {
	return gulp
		.src(["src/fonts/**/*.{woff,woff2}", "src/img/**", "src/js/**", "src//*.ico"], {
			base: "src",
		})
		.pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
	return del("build");
});

gulp.task("build", gulp.series("clean", "copy", "css", "sprite", "pug"));
gulp.task("start", gulp.series("build", "server"));
