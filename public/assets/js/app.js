var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'assets/js/videos/videos.htm',
            controller: 'VideosController'
        })
        .when('/upload', {
            templateUrl: 'assets/js/videos/upload.htm',
            controller: 'VideosController'
        })
        .when('/signin', {
            templateUrl: 'assets/js/signin/signin.html',
            controller: 'SigninController'
        })
        .when('/:videoID', {
            templateUrl: 'assets/js/videos/selectedVideo.htm',
            controller: 'CurrentVideoController'
        })
        .otherwise({
            template: "<h1>Please visit our video webpage</h1>"
        });
});