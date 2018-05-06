app.service('MyPlaylistsService', function ($http) {
    //gets all playlists that are created by the logged user
    this.getMyPlaylists = function () {
        return new Promise(function (resolve, reject) {
            $http.get('/api/myPlaylists')
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };


    // //deletes selected video
    // this.deleteVideo = function (id) {
    //     return new Promise(function (resolve, reject) {
    //         $http.delete('/api/myVideos/' + id)
    //             .then(function (response) {
    //                 resolve(response);
    //             })
    //             .catch(err => reject(err));
    //     });
    // };
    //
    //
    // //updates selected video
    // this.updateVideo = function (video) {
    //     return new Promise(function (resolve, reject) {
    //         $http.put('/api/myVideos/' + video._id, video)
    //             .then(function (response) {
    //                 resolve(response);
    //             })
    //             .catch(err => reject(err));
    //     });
    // };

});