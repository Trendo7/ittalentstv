app.service('TagsService', function ($http) {
    //gets all videos that have the searched TAG
    this.getVideos = function (tag) {
        return new Promise(function (resolve, reject) {
            $http.get('/api/results/tags/' + tag)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };

});