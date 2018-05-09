app.controller('UserVideosController', function ($scope, $window, $location, UserVideosService, UserCheckService) {
    const NOT_FOUND_ERROR = 404;
    const SERVER_ERROR = 500;
    const USER_POSITION = 2; //user position in the URL
    $scope.isValidUser = true;
    $scope.serverError = false;
    $scope.userVideos = [];
    $scope.userID = $location.path().split('/')[USER_POSITION];
    $scope.user = {};
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
        //--->>> redirects to notFound/serverError page <<<---
        .catch(err => {
            $scope.$apply(function () {
                if (err.status == NOT_FOUND_ERROR) {
                    console.log("This page isn't available. Sorry about that.Try searching for something else.");
                    $scope.isValidUser = false;
                }

                if (err.status == SERVER_ERROR){
                    console.log("Oops, something went wrong :(");
                    $scope.serverError = true;
                }
            });
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