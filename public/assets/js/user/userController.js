app.controller('UserController', function ($scope, $window, $location, UserService) {
    $scope.userVideos = [];
    $scope.userID = $location.path().substring($location.path().lastIndexOf('/') + 1);
    console.log($scope.userID);
    console.log(111);


    $scope.sortSelect = '';

    $scope.changeOption = function(option){
        console.log(option);
        $scope.sortSelect = option;
    };


    //load all videos that are uploaded by the selected user
    UserService.getUserVideos($scope.userID)
        .then(function (videos) {
            $scope.$apply(function () {
                $scope.userVideos = videos;
            });
        })
        .catch(err => console.log(err.data));

    //moved to mainController
    // $scope.openVideoLink = function (video) {
    //     $location.path(video._id);
    // };

});