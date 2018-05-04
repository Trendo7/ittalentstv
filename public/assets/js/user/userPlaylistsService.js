app.service('UserPlaylistsService', function ($http) {
    //gets all playlists that are created by the selected user
    this.getUserPlaylists = function (id) {
        return new Promise(function (resolve, reject) {
            $http.get('/api/userPlaylists/' + id)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };


    //needs to be updated and to decide what arguments will be provided also what will be posted to Server
    //creates new playlist
    this.createUserPlaylists = function (id) {
        return new Promise(function (resolve, reject) {
            $http.post('/api/userPlaylists', newPlaylist)
                .then(function (response) {

                })
                .catch(err => reject(err));
        });
    }
});