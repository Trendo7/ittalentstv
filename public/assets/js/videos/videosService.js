app.service('VideosService', function ($http) {
    //gets all videos in the database
    this.getVideos = function () {
        return new Promise(function (resolve, reject) {
            // $http.get('js/videos/videos.json')
            $http.get('/api/videos')
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };


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


    //update video rate (like/dislike) of watched video
    this.updateVideoRate = function (id, vote) {
        return new Promise(function (resolve, reject) {
            $http.put('/api/videos/rate/' + id, vote)
                .then(function (response) {
                    resolve(response);
                })
                .catch(err => {
                    reject(err);
                    console.log(err);
                });
        });
    };


    //gets all playlists that are created by the logged user
    this.getLoggedUserPlaylist = function (id) {
        return new Promise(function (resolve, reject) {
            $http.get('/api/userPlaylists/' + id)
                .then(function (response) {
                    resolve(response.data);
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
    }

});