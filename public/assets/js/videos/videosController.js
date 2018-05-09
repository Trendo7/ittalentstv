app.controller('VideosController', function ($scope, $window, $location, VideosService) {
    $scope.newestVideos = [];
    $scope.mostPopularVideos = [];


    //gets the newest videos form the database
    VideosService.getNewestVideos()
        .then(function (videos) {
            $scope.$apply(function () {
                $scope.newestVideos = videos;
            });
        })
        .catch(err => console.log(err));


    //gets the most popular videos form the database
    VideosService.getMostPopularVideos()
        .then(function (videos) {
            $scope.$apply(function () {
                $scope.mostPopularVideos = videos;
            });
        })
        .catch(err => console.log(err));


    $scope.getDate = function (date) {
        console.log(moment(date).fromNow())

    }
});



app.controller('CurrentVideoController', function ($scope, $window, $location, VideosService) {
    const MONGO_ID_LENGTH = 24;
    $scope.errMsg = "";
    $scope.videoID = $location.search().v;
    $scope.playlistID = "";
    $scope.currentVideo = {};
    $scope.videos = [];
    $scope.isLikedByMe = false;
    $scope.isDislikedByMe = false;
    $scope.categoryTitle = "";
    $scope.newPlaylistTitle = "";

    //check if videoID is invalid
    if ($scope.videoID.trim().length != MONGO_ID_LENGTH) {
        $scope.videoID = '';
        console.log("This page isn't available. Sorry about that.Try searching for something else.");
        $scope.errMsg = "This page isn't available. Sorry about that.Try searching for something else.";
        return;
    }

    //check if playlistID meets the length requirements of MongoDB
    if ((!!$location.search().list) && ($location.search().list.trim().length == MONGO_ID_LENGTH)) {
        $scope.playlistID = $location.search().list;
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
        .catch(err => {
            console.log(err);
            $scope.$apply(function () {
                $scope.videoID = '';
                console.log("This page isn't available. Sorry about that.Try searching for something else.");
                $scope.errMsg = "This page isn't available. Sorry about that.Try searching for something else.";
            });
        });

    if (!!$scope.playlistID) {
        getPlaylist($scope.playlistID, $scope.videoID);
    } else {
        getNewestVideos();
    }

    //gets all videos in the right sidebar
    function getNewestVideos() {
        VideosService.getNewestVideos()
            .then(function (videos) {
                $scope.$apply(function () {
                    $scope.videos = videos;
                    $scope.playlistID = "";
                    $scope.categoryTitle = "Newest videos";
                });
            })
            .catch(err => console.log(err));
    }

    //checks if the playlist is valid, whether the video is part of the playlist and gets playlist videos in the right sidebar
    function getPlaylist(playlistID,videoID) {
        VideosService.getPlaylist(playlistID, videoID)
            .then(function (playlist) {
                if (!!playlist) {
                    getPlaylistVideos(playlist);
                } else {
                    getNewestVideos();
                }
            })
            .catch(err => console.log(err));
    }

    //get playlist videos
    function getPlaylistVideos(playlist) {
        VideosService.getPlaylistVideos(playlist.videos)
            .then(function (videos) {
                $scope.$apply(function () {
                    $scope.videos = videos;
                    $scope.categoryTitle = playlist.title;
                });
            })
            .catch(err => console.log(err));
    }


    $scope.userPlaylists = [];
    //gets all playlists that are created by the logged user
    $scope.getLoggedUserPlaylist = function (userID) {
        VideosService.getLoggedUserPlaylist(userID)
            .then(function (playlists) {
                playlists.forEach(playlist => {
                   playlist.isChecked = !!playlist.videos.find(id => id === $scope.videoID);
                });
                $scope.$apply(function () {
                    $scope.userPlaylists = playlists;
                })
            })
            .catch(err => console.log(err.data));
    };


    //toggle song in the selected playlist
    $scope.toggleSong = function (playlist) {
        playlist.isChecked = !playlist.isChecked;
        VideosService.toggleSong(playlist, $scope.videoID)
            .then(function (response) {
                $scope.$apply(function () {
                    console.log(response);
                })
            })
            .catch(err => console.log(err.data));
    };


    //creates new playlist
    $scope.createPlaylist = function () {
        if ($scope.newPlaylistTitle.trim().length === 0) {
            return;
        }

        var newPlaylist = {
            title: $scope.newPlaylistTitle,
            videos: [$scope.currentVideo._id],
            imgUrl: $scope.currentVideo.thumbnailUrl
        };
        VideosService.createPlaylist(newPlaylist)
            .then(function (playlist) {
                playlist.isChecked = true;
                $scope.$apply(function () {
                    $scope.userPlaylists.push(playlist);
                    $scope.newPlaylistTitle = "";
                })
            })
            .catch(err => console.log(err.data));
    };


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

    //opens selected video and shows selected playlist if there is such
    $scope.openVideoLink = function (video) {
        if (!!$scope.playlistID) {
            $location.url('watch?v=' + video._id + '&list=' + $scope.playlistID);
        } else {
            $location.url('watch?v=' + video._id);
        }
    };

    //search videos by tag
    $scope.searchVideosByTag = function (tag) {
        $location.url('tags?tag=' + tag);
    };

});