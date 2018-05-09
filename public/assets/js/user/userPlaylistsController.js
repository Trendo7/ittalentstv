app.controller('UserPlaylistsController', function ($scope, $window, $location, UserPlaylistsService, UserCheckService) {
    const NOT_FOUND_ERROR = 404;
    const SERVER_ERROR = 500;
    const USER_POSITION = 2; //user position in the URL
    $scope.isValidUser = true;
    $scope.serverError = false;
    $scope.userPlaylists = [];
    $scope.userID = $location.path().split('/')[USER_POSITION];
    $scope.user = {};
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