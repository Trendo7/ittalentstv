app.controller('ResultsController', function($scope, $window, $location, ResultsService) {
    $scope.searchQuery = $location.search().search_query;
    $scope.videos = [];
    $scope.options = [
        {description: 'Most Popular', value: '-viewCount'},
        {description: 'Title', value: 'title'},
        {description: 'Likes', value: '-likedByUserIDs.length'},
        {description: 'Upload Date', value: '-uploadDate'}
    ];

    $scope.sortSelect = '';
    $scope.sortedBy = '';

    $scope.changeOption = function(option){
        $scope.sortedBy = option.description;
        $scope.sortSelect = option.value;
    };

    if (!$scope.searchQuery) {
        $location.url('/');
        return;
    }

    ResultsService.getVideos($scope.searchQuery)
        .then(function (videos) {
            $scope.$apply(function () {
                $scope.videos = videos;
            });
        })
        .catch(err => console.log(err));

});