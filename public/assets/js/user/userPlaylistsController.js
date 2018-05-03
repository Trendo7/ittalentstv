app.controller('UserPlaylistsController', function ($scope, $window, $location, UserPlaylistsService, UserCheckService) {
    const NOT_FOUND = 404;
    $scope.userPlaylists = [];
    // $scope.userID = $location.path().substring($location.path().lastIndexOf('/') + 1);
    $scope.userID = $location.path().split('/')[2];
    $scope.user = {};
    $scope.errMsg = {};
    $scope.isValidUser = true;
    $scope.hasPlaylists = true;
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
                if (user.playlists.length > 0) {
                    $scope.hasPlaylists = true;
                    getUserPlaylists(user._id);
                    console.log($scope.isValidUser);
                } else {
                    $scope.hasPlaylists = false;
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
    function getUserPlaylists (userID) {
        UserPlaylistsService.getUserPlaylists(userID)
            .then(function (playlists) {
                $scope.$apply(function () {
                    $scope.userPlaylists = playlists;
                })
            })
            .catch(err => console.log(err.data));
    }


    //moved to mainController
    // $scope.openVideoLink = function (video) {
    //     $location.path(video._id);
    // };

});