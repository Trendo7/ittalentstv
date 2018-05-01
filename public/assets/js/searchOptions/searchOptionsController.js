app.controller('SearchOptionsController', function ($scope, $timeout, SearchOptionsService) {
    $scope.searchStr = "";
    $scope.searchOptions = [];

    $scope.$watch('searchStr', function (tmpStr) {
        if (!tmpStr || tmpStr.length == 0) {
            return;
        }

        $timeout(function () {
            if (tmpStr === $scope.searchStr) {

                SearchOptionsService.showSearchProposals(tmpStr)
                    .then(function (results) {
                        console.log(results);
                        $scope.$apply(function () {
                            results.forEach(function (r) {
                                $scope.searchOptions.push(r.title);
                            });
                            console.log($scope.searchOptions);
                        });
                    })
                    .catch(err => alert(err.data.err));
            }
        }, 500);
    });


});