app.controller('UserPlaylistsController', function ($scope, $window, $location, UserPlaylistsService, UserCheckService) {
    const NOT_FOUND = 404;
    const USER_POSITION = 2;
    $scope.userPlaylists = [];
    $scope.userID = $location.path().split('/')[USER_POSITION];
    $scope.user = {};
    $scope.errMsg = {};
    // $scope.isValidUser = true;
    $scope.hasPlaylists = true;

    UserCheckService.checkUser($scope.userID)
        .then(function (user) {
            $scope.$apply(function () {
                $scope.user = user;
                $scope.isValidUser = true;
                if (user.playlists.length > 0) {
                    $scope.hasPlaylists = true;
                    $scope.getUserPlaylists(user._id);
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


    //get all playlists that are created by the selected user
    $scope.getUserPlaylists = function (userID) {
        UserPlaylistsService.getUserPlaylists(userID)
            .then(function (playlists) {
                $scope.$apply(function () {
                    $scope.userPlaylists = playlists;
                })
            })
            .catch(err => console.log(err.data));
    };

});