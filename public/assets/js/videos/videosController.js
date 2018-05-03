app.controller('VideosController', function ($scope, $window, $location, VideosService) {
    
    $scope.videos = [];

    VideosService.getVideos()
        .then(function (videos) {
            $scope.$apply(function () {
                $scope.videos = videos;
            });
        })
        .catch(err => console.log(err));

    $scope.getDate = function (date){
        console.log(moment(date).fromNow())    

    }   

    //moved to main controller
    // $scope.openVideoLink = function (video) {
    //     $location.path(video._id);
    // };
    //
    // $scope.openUserLink = function (video) {
    //     $location.path('user/' + video.uploadedByID);
    // };

});

app.controller('CurrentVideoController', function ($scope, $location, VideosService) {
    $scope.videoID = $location.path().substring(1);
    $scope.currentVideo = {};
    $scope.videos = [];
    $scope.isLikedByMe = false;
    $scope.isDislikedByMe = false;

    function checkIsRatedByMe() {
        var user = JSON.parse(localStorage.getItem('logged'));
        if (!!user) {
            if (!!$scope.currentVideo.likedByUserIDs.find(id => id === user.userId)) {
                $scope.isLikedByMe = true;
            } else {
                $scope.isLikedByMe = false;
            }

            if (!!$scope.currentVideo.dislikedByUserIDs.find(id => id === user.userId)) {
                $scope.isDislikedByMe = true;
            } else {
                $scope.isDislikedByMe = false;
            }
        }
    }


    //loads selected video
    VideosService.loadVideo($scope.videoID)
        .then(function (currentVideo) {
            $scope.$apply(function () {
                $scope.currentVideo = currentVideo;
                checkIsRatedByMe();
            });
        })
        //--->>> must redirect to not found page <<<---
        .catch(err => console.log(err));


    //gets all videos in the right sidebar
    VideosService.getVideos()
        .then(function (videos) {
            $scope.$apply(function () {
                $scope.videos = videos;
            });
        })
        .catch(err => console.log(err));


    //update video rate (like/dislike) of watched video
    $scope.updateVideoRate = function (vote) {
        VideosService.updateVideoRate($scope.videoID, {vote: vote})
            .then(function (response) {
                $scope.$apply(function () {
                    $scope.currentVideo.likedByUserIDs = response.data.likedByUserIDs;
                    $scope.currentVideo.dislikedByUserIDs = response.data.dislikedByUserIDs;
                    checkIsRatedByMe();
                });
            })
            //--->>> if error is 401 must show option for login <<<---
            //--->>> if error is 403 must alert that this video is uploaded by the same user <<<---
            .catch(err => console.log(err));
    };

    //moved to main controller
    // $scope.openVideoLink = function (video) {
    //     $location.path(video._id);
    // };
    //
    // $scope.openUserLink = function (video) {
    //     $location.path('user/' + video.uploadedByID);
    // };

});