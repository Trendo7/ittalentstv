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


    // //deletes the selected video
    // $scope.deleteVideo = function(video) {
    //     var videoId = video._id;
    //     var firebaseId = video.uploadDate;
    //
    //     //Reference to firebase storage => videos
    //     var storageRef = firebase.storage().ref('videos')
    //
    //     // Create a reference to the file which we want to delete
    //     var desertRef = storageRef.child(firebaseId.toString() + ".mp4");
    //
    //      // Delete the file from mongo
    //     MyVideosService.deleteVideo(videoId)
    //         .then(function() {
    //
    //             // If the file has successfully deleted from mongo, we delete it from firebase
    //             desertRef.delete()
    //                 .then(function() {
    //                     console.log('Deleted from firebase!')
    //                 })
    //                 .catch(function(error) {
    //                     console.log(error)
    //                 });
    //
    //             //
    //             MyVideosService.getMyVideos()
    //                 .then(function(videos) {
    //                     $scope.$apply(function() {
    //                         $scope.myVideos = videos;
    //                     });
    //                 })
    //                 .catch(err => alert(err.data.err));
    //         })
    //         .catch(err => alert(err.data.err));
    // };
    //
    //
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