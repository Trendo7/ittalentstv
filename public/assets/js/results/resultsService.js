app.service('ResultsService', function ($http) {
    //gets all videos that match the search query
    this.getVideos = function (searchQuery) {
        return new Promise(function (resolve, reject) {
            $http.get('/api/results/search_query/' + searchQuery)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };

});