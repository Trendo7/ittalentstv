app.controller('UserController', function ($scope, $window, $location, UserService) {
    $scope.userVideos = [];
    $scope.userID = $location.path().substring($location.path().lastIndexOf('/') + 1);
    $scope.options = [
        {description: 'Most Popular', value: '-viewCount'},
        {description: 'Title', value: 'title'},
        {description: 'Tags', value: '-tags.length'},
        {description: 'Likes', value: '-likedByUserIDs.length'},
        {description: 'Upload Date', value: '-uploadDate'}
    ];


    $scope.sortSelect = '';
    $scope.sortedBy = '';

    $scope.changeOption = function(option){
        $scope.sortedBy = option.description;
        $scope.sortSelect = option.value;
    };


    //load all videos that are uploaded by the selected user
    UserService.getUserVideos($scope.userID)
        .then(function (videos) {
            $scope.$apply(function () {
                $scope.userVideos = videos;
            });
        })
        .catch(err => console.log(err.data));

    //moved to mainController
    // $scope.openVideoLink = function (video) {
    //     $location.path(video._id);
    // };

});