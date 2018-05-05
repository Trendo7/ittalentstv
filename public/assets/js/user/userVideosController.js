app.controller('UserVideosController', function ($scope, $window, $location, UserVideosService, UserCheckService) {
    const NOT_FOUND = 404;
    $scope.userVideos = [];
    // $scope.userID = $location.path().substring($location.path().lastIndexOf('/') + 1);
    $scope.userID = $location.path().split('/')[2];
    $scope.user = {};
    $scope.errMsg = {};
    $scope.isValidUser = true;
    $scope.hasVideos = true;
    $scope.options = [
        {description: 'Most Popular', value: '-viewCount'},
        {description: 'Title', value: 'title'},
        {description: 'Likes', value: '-likedByUserIDs.length'},
        {description: 'Upload Date', value: '-uploadDate'}
    ];

    $scope.sortSelect = '';
    $scope.sortedBy = '';

    $scope.changeOption = function(option){
        $scope.sortedBy = option.description;
        $scope.sortSelect = option.value;
    };


    UserCheckService.checkUser($scope.userID)
        .then(function (user) {
            $scope.$apply(function () {
                $scope.user = user;
                $scope.isValidUser = true;
                if (user.uploadedVideos.length > 0) {
                    $scope.hasVideos = true;
                    getUserVideos(user._id);
                } else {
                    $scope.hasVideos = false;
                }
            });
        })
        //if 404 it means that there is no such user if 500 server error
        .catch(err => {
            console.log(err);
            if (err.status === NOT_FOUND) {
                $scope.$apply(function () {
                    $scope.isValidUser = false;
                    $scope.errMsg = err.data.err;
                });
            }
        });


    //get all videos that are uploaded by the selected user
    function getUserVideos (userID) {
        UserVideosService.getUserVideos(userID)
            .then(function (videos) {
                $scope.$apply(function () {
                    $scope.userVideos = videos;
                })
            })
            .catch(err => console.log(err.data));
    }

});