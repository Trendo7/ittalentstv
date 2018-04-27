app.controller('MainController', function ($scope, $rootScope, $http, $location, $window) {
    (function () {
        if ($rootScope.logged != JSON.parse(localStorage.getItem('logged'))) {
            $rootScope.logged = JSON.parse(localStorage.getItem('logged'));
        }
        console.log($rootScope.logged);
    })();
});