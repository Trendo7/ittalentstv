app.controller('SearchOptionsController', function ($scope, $location, $timeout, SearchOptionsService) {
    $scope.searchStr = "";
    $scope.searchOptions = [];
    const ENTER_KEY = 13;

    $scope.$watch('searchStr', function (tmpStr) {
        if (!tmpStr || tmpStr.length == 0) {
            return;
        }

        $timeout(function () {
            if (tmpStr === $scope.searchStr) {

                SearchOptionsService.showSearchSuggestions(tmpStr)
                    .then(function (results) {
                        $scope.$apply(function () {
                            $scope.searchOptions = results;
                        });
                    })
                    .catch(err => console.log(err.data));
            }
        }, 300);
    });


    //search videos by searchQuery
    $scope.searchVideos = function (searchQuery) {
        $location.url('results?search_query=' + searchQuery);
    };

    //input field listens for pressed enter_key
    $scope.listenForEnter = function (keyEvent, searchQuery) {
        if (keyEvent.which === ENTER_KEY) {
            $scope.searchVideos(searchQuery);
        }
    };
});