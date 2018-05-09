app.service('SelectedVideoService', function ($http) {
    //loads selected video
    this.loadVideo = function (id) {
        return new Promise(function (resolve, reject) {
            $http.get('/api/videos/' + id)
                .then(function (response) {
                    var currentVideo = response.data;
                    resolve(currentVideo);
                })
                .catch(err => reject(err));
        });
    };


    //loads similar videos
    this.getSimilarVideos = function (selectedVideo) {
        return new Promise(function (resolve, reject) {
            $http.post('/api/videos/similarVideos', selectedVideo)
                .then(function (response) {
                    //response.data contains 2 properties: 1)message, 2)videos (array with videos)
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };


    //update video rate (like/dislike) of watched video
    this.updateVideoRate = function (id, vote) {
        return new Promise(function (resolve, reject) {
            $http.put('/api/videos/rate/' + id, vote)
                .then(function (response) {
                    resolve(response);
                })
                .catch(err => reject(err));
        });
    };


    //gets all playlists that are created by the logged user
    this.getLoggedUserPlaylist = function (userID) {
        return new Promise(function (resolve, reject) {
            $http.get('/api/userPlaylists/' + userID)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };


    //checks if the playlist is valid and whether the video is part of the playlist
    this.getPlaylist = function (playlistID, videoID) {
        return new Promise(function (resolve, reject) {
            $http.post('/api/userPlaylists/playlist/' + playlistID, {videoID})
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };


    //get playlist videos
    this.getPlaylistVideos = function (videoIDs) {
        return new Promise(function (resolve, reject) {
            $http.post('/api/videos/byPlaylist/', {videoIDs})
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };


    //toggle song in the selected playlist
    this.toggleSong = function (playlist, videoId) {
        return new Promise(function (resolve, reject) {
            $http.put('/api/userPlaylists/' + playlist._id, {videoId: videoId, isChecked: playlist.isChecked})
                .then(function (response) {
                    resolve(response.data.message);
                })
                .catch(err => reject(err));
        });
    };


    //creates new playlist
    this.createPlaylist = function (newPlaylist) {
        return new Promise(function (resolve, reject) {
            $http.post('/api/userPlaylists', newPlaylist)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };

});