app.controller('ResultsController', function($scope, $window, $location, ResultsService) {
    var searchQuery = $location.search().search_query;
    if ((typeof searchQuery != "string") || !searchQuery) {
        $location.url('/');
        return;
    }

    filterOptions($scope);

    ResultsService.getVideos(searchQuery)
        .then(function (videos) {
            $scope.$apply(function () {
                $scope.videos = videos;
            });
        })
        .catch(err => console.log(err));

});