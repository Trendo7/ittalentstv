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


    // //loads video title, description and tags in the edit form
    // $scope.editVideo = function(video) {
    //     $scope.editedVideo = {
    //         _id: video._id,
    //         title: video.title,
    //         description: video.description,
    //         tags: video.tags.toString()
    //     };
    // };
    //
    //
    // //saves video details after edit is completed
    // $scope.saveChanges = function(updatedVideo) {
    //     updatedVideo.tags = updatedVideo.tags.split(',');
    //     MyVideosService.updateVideo(updatedVideo)
    //         .then(function() {
    //             MyVideosService.getMyVideos()
    //                 .then(function(videos) {
    //                     $scope.$apply(function() {
    //                         $scope.myVideos = videos;
    //                         angular.element('#close-edit-modal').trigger('click');
    //                         $scope.editedVideo = {};
    //                     });
    //                 })
    //                 .catch(err => alert(err.data.err));
    //         })
    //         .catch(err => alert(err.data.err));
    // };

});