app.controller('VideosController', function ($scope, $window, $location, VideosService) {
    $scope.videos = [];

    VideosService.getVideos().then(function (videos) {
        $scope.$apply(function () {
            $scope.videos = videos;
        });
    });

    // $scope.openLink = function(location){
    //     console.log(location);
    //     $window.location = location;
    // }

    $scope.openLink = function (video) {
        // $window.location.href = video.id;
        // $scope.currentVideo = video;
        // console.log($scope.currentVideo);
        $location.path(video._id);
    };

    $scope.deleteVideo = function (video) {
        var videoId = video._id;
        console.log(videoId);
        VideosService.deleteVideo(videoId)
        .then(function(){
            VideosService.getVideos()
            .then(function (videos) {
                $scope.$apply(function () {
                    $scope.videos = videos;
                });
            });
        });
    };
});

app.controller('CurrentVideoController', function ($scope, $location, VideosService) {
    var videoID = $location.path().substring(1);
    VideosService.loadVideo(videoID)
    .then(function (currentVideo) {
        $scope.$apply(function () {
            $scope.currentVideo = currentVideo;
        });
    });

    VideosService.getVideos()
            .then(function (videos) {
                $scope.$apply(function () {
                    $scope.videos = videos;
                });
            });

            
});