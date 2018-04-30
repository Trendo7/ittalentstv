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
            $http.get('http://localhost:3000/videos')
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };


    //loads selected video
    this.loadVideo = function (id) {
        return new Promise(function (resolve, reject) {
            $http.get('http://localhost:3000/videos/' + id)
                .then(function (response) {
                    var currentVideo = response.data[0];
                    resolve(currentVideo);
                })
                .catch(err => reject(err));
        });
    };

    //needs improvement
    //Update view count of watched video
    this.updateViewCount = function (id) {
        return new Promise(function (resolve, reject) {
            $http.put('http://localhost:3000/videos/' + id)
                .then(function (response) {
                    resolve(response);
                })
                .catch(err => reject(err));
        });
    };

});