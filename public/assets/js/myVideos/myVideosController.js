app.controller('MyVideosController', function($scope, $window, $location, MyVideosService, $timeout) {
    $scope.myVideos = [];
    $scope.editedVideo = {};


    //loads all user videos
    MyVideosService.getMyVideos()
        .then(function(videos) {
            $scope.$apply(function() {
                $scope.myVideos = videos;
            });
        })
        .catch(err => alert(err.data.err));


    //deletes the selected video
    $scope.deleteVideo = function(video) {
        var videoId = video._id;
        var firebaseId = video.uploadDate;

        //Reference to firebase storage => videos
        var storageRef = firebase.storage().ref('videos')

        // Create a reference to the file which we want to delete
        var desertRef = storageRef.child(firebaseId.toString() + ".mp4");

         // Delete the file from mongo
        MyVideosService.deleteVideo(videoId)
            .then(function() {

                // If the file has successfully deleted from mongo, we delete it from firebase
                desertRef.delete()
                    .then(function() {
                        console.log('Deleted from firebase!')
                    })
                    .catch(function(error) {
                        console.log(error)
                    });

                //    
                MyVideosService.getMyVideos()
                    .then(function(videos) {
                        $scope.$apply(function() {
                            $scope.myVideos = videos;
                        });
                    })
                    .catch(err => alert(err.data.err));
            })
            .catch(err => alert(err.data.err));
    };


    //loads video title, description and tags in the edit form
    $scope.editVideo = function(video) {
        $scope.editedVideo = {
            _id: video._id,
            title: video.title,
            description: video.description,
            tags: video.tags.toString()
        };
    };


    //saves video details after edit is completed
    $scope.saveChanges = function(updatedVideo) {
        updatedVideo.tags = updatedVideo.tags.split(',');
        MyVideosService.updateVideo(updatedVideo)
            .then(function() {
                MyVideosService.getMyVideos()
                    .then(function(videos) {
                        $scope.$apply(function() {
                            $scope.myVideos = videos;
                            angular.element('#close-edit-modal').trigger('click');
                            $scope.editedVideo = {};
                        });
                    })
                    .catch(err => alert(err.data.err));
            })
            .catch(err => alert(err.data.err));
    };


    // angular.element('#tags-edit').tagsinput('refresh');


    // $scope.editVideo = function (video) {
    //     angular.element('#title-edit').val(video.title);
    //     angular.element('#description-edit').val(video.description);
    //     angular.element('#tags-edit').val(video.tags.toString());
    //     angular.element('#tags-edit').tagsinput('refresh');
    //
    //
    //     angular.element('#save').on('click', function () {
    //         video.title = angular.element('#title-edit').val();
    //         video.description = angular.element('#description-edit').val();
    //         video.tags = angular.element('#tags-edit').val().split(',');;
    //
    //
    //         console.log(video.title);
    //         console.log(video.description);
    //         console.log(video.tags);
    //
    //         var videoId = video._id;
    //
    //         MyVideosService.updateVideo(videoId)
    //             .then(function () {
    //                 MyVideosService.getMyVideos()
    //                     .then(function (videos) {
    //                         $scope.$apply(function () {
    //                             $scope.myVideos = videos;
    //                         });
    //                     })
    //                     .catch(err => alert(err.data.err));
    //             })
    //             .catch(err => alert(err.data.err));
    //
    //     })
    // }

});