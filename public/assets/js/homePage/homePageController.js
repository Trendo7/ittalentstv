app.controller('HomePageController', function ($scope, $window, $location, HomePageService) {
    $scope.newestVideos = [];
    $scope.mostPopularVideos = [];


    //gets the newest videos form the database
    HomePageService.getNewestVideos()
        .then(function (videos) {
            $scope.$apply(function () {
                $scope.newestVideos = videos;
            });
        })
        .catch(err => console.log(err));


    //gets the most popular videos form the database
    HomePageService.getMostPopularVideos()
        .then(function (videos) {
            $scope.$apply(function () {
                $scope.mostPopularVideos = videos;
            });
        })
        .catch(err => console.log(err));
    
});