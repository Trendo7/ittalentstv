app.service('UserPlaylistsService', function ($http) {
    //gets all playlists that are created by the selected user
    this.getUserPlaylists = function (id) {
        return new Promise(function (resolve, reject) {
            $http.get('http://localhost:3000/userPlaylists/' + id)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };

});