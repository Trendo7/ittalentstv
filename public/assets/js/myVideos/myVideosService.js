app.service('MyVideosService', function ($http) {
    //gets all videos that are uploaded by the logged user
    this.getMyVideos = function () {
        return new Promise(function (resolve, reject) {
            $http.get('/api/myVideos')
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };


    //deletes selected video
    this.deleteVideo = function (id) {
        return new Promise(function (resolve, reject) {
            $http.delete('/api/myVideos/' + id)
                .then(function (response) {
                    resolve(response);
                })
                .catch(err => reject(err));
        });
    };


    //updates selected video
    this.updateVideo = function (video) {
        return new Promise(function (resolve, reject) {
            $http.put('/api/myVideos/' + video._id, video)
                .then(function (response) {
                    resolve(response);
                })
                .catch(err => reject(err));
        });
    };

});