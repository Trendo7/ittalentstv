// function Video (title, url, description) {
//     this.title = title;
//     this.url = url;
//     this.description = description;
//     this.id = 0;
//     this.uploadedBy = '';
//     this.comments = [];
//     this.viewCount = 0;
//     this.likeCount = 0;
//     this.dislikeCount = 0;
// }


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

    //needs improvement
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

});