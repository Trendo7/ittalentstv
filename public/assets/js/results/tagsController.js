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


    TagsService.getVideos(tag)
        .then(function (videos) {
            $scope.$apply(function () {
                $scope.videos = videos;
            });
        })
        .catch(err => console.log(err));

});