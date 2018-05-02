app.service('UserVideosService', function ($http) {
    //gets all videos that are uploaded by the selected user
    this.getUserVideos = function (id) {
        return new Promise(function (resolve, reject) {
            $http.get('http://localhost:3000/userVideos/' + id)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };

});