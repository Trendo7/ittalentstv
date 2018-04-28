app.controller('MyVideosController', function ($scope, $window, $location, MyVideosService) {
    $scope.myVideos = [];

    MyVideosService.getMyVideos().then(function (videos) {
        $scope.$apply(function () {
            $scope.myVideos = videos;
        });
    });


    $scope.deleteVideo = function (video) {
        var videoId = video._id;

        MyVideosService.deleteVideo(videoId).then(function () {
            MyVideosService.getMyVideos().then(function (videos) {
                $scope.$apply(function () {
                    $scope.myVideos = videos;
                });
            });
        });
    };


    $scope.openLink = function(video){
        $location.path(video._id);
    };

});
