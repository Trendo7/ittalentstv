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


    //needs improvement
    VideosService.updateViewCount(videoID)
        .then(function () {
            VideosService.loadVideo(videoID)
                .then(function (currentVideo) {
                    $scope.$apply(function () {
                        $scope.currentVideo = currentVideo;
                    });
                });
            });


    VideosService.getVideos().then(function (videos) {
        $scope.$apply(function () {
            $scope.videos = videos;
        });
    });


    $scope.openLink = function (video) {
        $location.path(video._id);
    };

});