app.controller('LogoutController', function ($scope, $http, $location, $window) {
    const OK = 200;


    $http.get('/api/logout')
        .then(function (response) {
            if (response.status == OK) {
                console.log(response.data);
                localStorage.removeItem('logged');

            }
        })
});