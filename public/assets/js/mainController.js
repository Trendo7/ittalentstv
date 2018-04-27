app.controller('MainController', function ($scope, $rootScope, $http, $location, $window) {
    (function () {
        if ($rootScope.logged != JSON.parse(localStorage.getItem('logged'))) {
            $rootScope.logged = JSON.parse(localStorage.getItem('logged'));
        }
        console.log($rootScope.logged);
    })();


    const OK = 200;

    $rootScope.logout = function () {
        $http.get('http://localhost:3000/logout')
            .then(function (response) {
                if (response.status == OK) {
                    console.log(response.data);
                    localStorage.removeItem('logged');
                    $window.location.href = '/';
                }
            })
    }
});