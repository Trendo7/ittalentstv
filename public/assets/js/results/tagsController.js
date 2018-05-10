app.controller('TagsController', function($scope, $window, $location, TagsService) {
    var tags = $location.search().tag;
    if ((typeof tags != "string") || !tags) {
        $location.url('/');
        return;
    }

    var tagsArr = tags.trim().split(' ');
    if (tagsArr > 1) {
        $location.url('/');
        return;
    }

    var tag = tagsArr[0];

    filterOptions($scope);

    TagsService.getVideos(tag)
        .then(function (videos) {
            $scope.$apply(function () {
                $scope.videos = videos;
            });
        })
        .catch(err => console.log(err));

});