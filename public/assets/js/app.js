var app = angular.module('app', ['ngRoute', 'angularMoment']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'assets/js/videos/videos.htm',
            controller: 'VideosController'
        })
        .when('/signin', {
            templateUrl: 'signin.html',
            controller: 'SigninController'
        })
        .when('/upload', {
            templateUrl: 'assets/js/upload/upload.htm',
            controller: 'UploadController'
        })
        .when('/account', {
            templateUrl: 'assets/js/account/account.htm',
            controller: 'AccountController'
        })
        .when('/my_videos', {
            templateUrl: 'assets/js/myVideos/myVideos.htm',
            controller: 'MyVideosController'
        })
        .when('/my_playlists', {
            templateUrl: 'assets/js/myPlaylists/myPlaylists.htm',
            controller: 'MyPlaylistsController'
        })
        .when('/results', {
            templateUrl: 'assets/js/results/results.htm',
            controller: 'ResultsController'
        })
        .when('/tags', {
            templateUrl: 'assets/js/results/results.htm',
            controller: 'TagsController'
        })
        .when('/user/:userID', {
            templateUrl: 'assets/js/user/userVideos.htm',
            controller: 'UserVideosController'
        })
        .when('/user/:userID/videos', {
            templateUrl: 'assets/js/user/userVideos.htm',
            controller: 'UserVideosController'
        })
        .when('/user/:userID/playlists', {
            templateUrl: 'assets/js/user/userPlaylist.htm',
            controller: 'UserPlaylistsController'
        })
        .when('/watch', {
            templateUrl: 'assets/js/videos/selectedVideo.htm',
            controller: 'CurrentVideoController'
        })
        .otherwise({
            templateUrl: "notFound.htm"
        });
});