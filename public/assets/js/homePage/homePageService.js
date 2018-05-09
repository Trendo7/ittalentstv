app.service('HomePageService', function ($http) {
    //gets the newest videos form the database
    this.getNewestVideos = function () {
        return new Promise(function (resolve, reject) {
            $http.get('/api/videos/newest')
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };


    //gets the most popular videos form the database
    this.getMostPopularVideos = function () {
        return new Promise(function (resolve, reject) {
            $http.get('/api/videos/mostPopular')
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };

});