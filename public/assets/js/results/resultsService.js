app.service('ResultsService', function ($http) {
    //gets all videos that match the search query
    this.getVideos = function (searchQuery) {
        return new Promise(function (resolve, reject) {
            $http.get('/api/results/' + searchQuery)
                .then(function (response) {
                    console.log(response.data);
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };

});