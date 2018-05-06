app.controller('MyPlaylistsController', function($scope, $window, $location, MyPlaylistsService) {
    $scope.myPlaylists = [];
    $scope.editedPlaylist = {};


    //loads all user playlist
    MyPlaylistsService.getMyPlaylists()
        .then(function(playlists) {
            $scope.$apply(function() {
                $scope.myPlaylists = playlists;
            });
        })
        .catch(err => alert(err.data.err));


    //deletes the selected playlist
    $scope.deletePlaylist = function(playlist) {
        var playlistId = playlist._id;

        MyPlaylistsService.deletePlaylist(playlistId)
            .then(function() {
                MyPlaylistsService.getMyPlaylists()
                    .then(function(playlists) {
                        $scope.$apply(function() {
                            $scope.myPlaylists = playlists;
                        });
                    })
                    .catch(err => alert(err.data.err));
            })
            .catch(err => alert(err.data.err));
    };


    //loads playlist title in the edit form
    $scope.editPlaylist = function(playlist) {
        $scope.editedPlaylist = {
            _id: playlist._id,
            title: playlist.title
        };
    };


    //saves playlist details after edit is completed
    $scope.saveChanges = function(updatedPlaylist) {
        MyPlaylistsService.updatePlaylist(updatedPlaylist)
            .then(function() {
                MyPlaylistsService.getMyPlaylists()
                    .then(function(playlists) {
                        $scope.$apply(function() {
                            $scope.myPlaylists = playlists;
                            angular.element('#close-edit-modal').trigger('click');
                            $scope.editedPlaylist = {};
                        });
                    })
                    .catch(err => alert(err.data.err));
            })
            .catch(err => alert(err.data.err));
    };

});