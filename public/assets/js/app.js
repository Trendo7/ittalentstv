var app = angular.module('app', ['ngRoute']);

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
            templateUrl: 'assets/js/videos/upload.htm',
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
        .when('/:videoID', {
            templateUrl: 'assets/js/videos/selectedVideo.htm',
            controller: 'CurrentVideoController'
        })
        .otherwise({
            template: "<h1>Please visit our video webpage</h1>"
        });
});