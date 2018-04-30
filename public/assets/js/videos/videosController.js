app.controller('VideosController', function ($scope, $window, $location, VideosService) {
    $scope.videos = [];

    VideosService.getVideos().then(function (videos) {
        $scope.$apply(function () {
            $scope.videos = videos;
        });
    });


    $scope.openLink = function (video) {
        $location.path(video._id);
    };

});

app.controller('CurrentVideoController', function ($scope, $location, VideosService) {
    var videoID = $location.path().substring(1);
    $scope.currentVideo = {};
    $scope.videos = [];


    //loads selected video
    VideosService.loadVideo(videoID)
        .then(function (currentVideo) {
            $scope.$apply(function () {
                $scope.currentVideo = currentVideo;
            });
        })
        //--->>> must redirect to not found page <<<---
        .catch(err => console.log(err));


    //gets all videos in the right sidebar
    VideosService.getVideos().then(function (videos) {
        $scope.$apply(function () {
            $scope.videos = videos;
        });
    });


    $scope.openLink = function (video) {
        $location.path(video._id);
    };

});