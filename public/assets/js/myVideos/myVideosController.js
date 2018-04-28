app.controller('MyVideosController', function ($scope, $window, $location, MyVideosService) {
    $scope.myVideos = [];

    MyVideosService.getVideos().then(function (videos) {
        $scope.$apply(function () {
            $scope.myVideos = videos;
        });
    });


    $scope.deleteVideo = function (video) {
        var videoId = video._id;

        MyVideosService.deleteVideo(videoId).then(function(){
            MyVideosService.getVideos().then(function (videos) {
                $scope.$apply(function () {
                    $scope.videos = videos;
                });
            });
        });
    };


    // $scope.openLink = function(location){
    //     console.log(location);
    //     $window.location = location;
    // }
    //
    // $scope.openLink = function (video) {
    //     // $window.location.href = video.id;
    //     // $scope.currentVideo = video;
    //     // console.log($scope.currentVideo);
    //     $location.path(video._id);
    // };
    //

});
