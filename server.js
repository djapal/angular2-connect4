var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var appDev = 'dev/';
var appProd = 'app/';

var assetsDev = 'assets/';
var assetsProd = 'src/';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var ext_replace = require('gulp-ext-replace');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var cssnano = require('cssnano');

var tsProject = typescript.createProject('tsconfig.json');

var express = require('express');
var favicon = require('serve-favicon');

var app = express();
var player1 = 0;
var player2 = 0;

/**
 * gulp stuff...
 */
gulp.src(appDev + '**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(typescript(tsProject))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(appProd));

gulp.src(assetsDev + 'scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(postcss([precss, autoprefixer, cssnano]))
    .pipe(sourcemaps.write())
    .pipe(ext_replace('.css'))
    .pipe(gulp.dest(assetsProd + 'css/'));


console.log("Starting web server at " + server_ip_address + ":" + server_port);

app.use('/', express.static(__dirname));
app.use(favicon(__dirname + '/favicon.ico'));

var server = app.listen(server_port, server_ip_address, function() { console.log('listening'); });
var io     = require('socket.io')(server);

/**
 * socket.io stuff
 */
io.on('connection', function (socket) {

    if (player1 === 0) {
        socket.name = 0;
        socket.emit('assignPlayerNumber', 0);
        player1 = 1;
    } else {
        if (player2 === 0) {
            socket.name = 1;
            socket.emit('assignPlayerNumber', 1);
            player2 = 1;
        } else {
            io.emit('newConnection', 2);
        }
    }

    socket.on('gameOver', function () {
        io.emit('gameOver');
    });

    socket.on('disconnect', function () {
        console.log('user ' + socket.name + ' disconnected');
        if (socket.name === 0) {
            player1 = 0;
        } else {
            player2 = 0;
        }
        io.emit('resetBoard');
        console.log(player1, player2);
    });

    socket.on('makeMove', function (data, player) {
        io.emit('updateBoard', data, player);
    });
});
