app.controller('SearchOptionsController', function ($scope, $timeout, SearchOptionsService) {
    $scope.searchStr = "";
    $scope.searchOptions = [];

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
                            console.log(results);
                        });
                    })
                    .catch(err => console.log(err.data));
            }
        }, 300);
    });


});