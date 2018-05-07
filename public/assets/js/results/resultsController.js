app.controller('ResultsController', function($scope, $window, $location, ResultsService) {
    $scope.searchQuery = $location.search().search_query;
    $scope.videos = [];

    if (!$scope.searchQuery) {
        console.log($scope.searchQuery);
        console.log('molq vyvedete tekst');
        $location.url('/');
        return;
    } else {
        console.log($scope.searchQuery);
        console.log('vashata zаqvka se obrabotva');
    }

    ResultsService.getVideos($scope.searchQuery)
        .then(function (videos) {
            $scope.$apply(function () {
                $scope.videos = videos;
            });
        })
        .catch(err => console.log(err));

});