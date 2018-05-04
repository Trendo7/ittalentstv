app.controller('SearchController', function($scope, $window, $location, MyVideosService, $timeout) {
    $scope.myVideos = [];
    $scope.editedVideo = {};


    $scope.sortSelect = '';

    $scope.changeOption = function(option) {
        console.log(option);
        $scope.sortSelect = option;
    }

    //loads all user videos
    MyVideosService.getMyVideos()
        .then(function(videos) {
            $scope.$apply(function() {
                $scope.myVideos = videos;
            });
        })
        .catch(err => alert(err.data.err));



    $scope.openLink = function(video) {
        $location.path(video._id);
    };



});