app.controller('UserController', function ($scope, $window, $location, UserService) {
    $scope.userVideos = [];
    $scope.userID = $location.path().substring($location.path().lastIndexOf('/') + 1);
    $scope.uploadedBy = '';
    $scope.hasVideos = true;
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
                if (videos.length > 0) {
                    $scope.hasVideos = true;
                    $scope.uploadedBy = videos[0].uploadedBy;
                    $scope.userVideos = videos;
                } else {
                    $scope.hasVideos = false;
                }
            });
        })
        .catch(err => console.log(err.data));

    //moved to mainController
    // $scope.openVideoLink = function (video) {
    //     $location.path(video._id);
    // };

});