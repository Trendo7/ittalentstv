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

    this.loadVideo = function (id) {
        return new Promise(function (resolve, reject) {
            $http.get('http://localhost:3000/videos/' + id)
                .then(function (response) {
                    var currentVideo = response.data.find(video => video._id == id);
                    if (!!currentVideo) {
                        resolve(currentVideo);
                    } else {
                        throw new Error('There is no such ID');
                    }

                })
                .catch(err => reject(err));
        });
    };

    this.deleteVideo = function (id) {
        return new Promise(function (resolve, reject) {
            $http.delete('http://localhost:3000/videos/' + id)
                .then(function (response) {
                    var deletedVideo = response;
                    if (!!deletedVideo) {
                        resolve(deletedVideo);
                    } else {
                        throw new Error('There is no such ID');
                    }

                })
                .catch(err => reject(err));
        });
    };
});