const {src, dest, parallel, series} = require('gulp');
const $ = require('gulp-load-plugins')();

const eslint = () => src(['**/*.js', '!node_modules/**', '!coverage/**', '!dist/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());

const mocha = () => src('src/**/*.js')
    .pipe($.istanbul())
    .on('finish',
        () => src('test/**/*.test.js')
            .pipe($.mocha({reporter: 'spec'}))
            .pipe($.istanbul.writeReports())
            .on('error', process.exit.bind(process, 1))
            .on('end', process.exit.bind(process))
    );

const server = () => $.nodemon({
    script: './',
    env: {NODE_ENV: process.env.NODE_ENV || 'development'},
    ignore: ['./test/**/*.js'],
    nodeArgs: ['--inspect']
});

const clean = () => require('del')('dist');

const copy = () => src(['users.js.js', './config/**', './sql/**', './src/**', './tasks/**'], {base: '.'})
    .pipe(dest('dist'));

const distPackage = () => src('./package.json')
    .pipe($.jsonEditor(
        json => {
            delete json.devDependencies;
            return json;
        }, {end_with_newline: true}
    ))
    .pipe(dest('dist/'));

const dist = parallel(copy, distPackage);

exports.eslint = eslint;
exports.mocha = mocha;
exports.test = parallel(eslint);
exports.dev = server;
exports['build-uat'] = exports.build = series(clean, dist);
