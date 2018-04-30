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
    $scope.videoID = $location.path().substring(1);
    $scope.currentVideo = {};
    $scope.videos = [];


    //loads selected video
    VideosService.loadVideo($scope.videoID)
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


    //update video rate count of watched video
    $scope.updateRateCount = function (vote) {
        VideosService.updateRateCount($scope.videoID, {vote: vote})
            .then(function (response){
                $scope.$apply(function () {
                    $scope.currentVideo.likeCount = response.data.likeCount;
                    $scope.currentVideo.dislikeCount = response.data.dislikeCount;
                });
            });
    };


    $scope.openLink = function (video) {
        $location.path(video._id);
    };

});