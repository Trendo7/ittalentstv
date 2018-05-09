app.controller('LogoutController', function ($scope, $http, $location, $window) {
    const OK = 200;

    $http.get('/api/logout')
        .then(function (response) {
            if (response.status == OK) {
                localStorage.removeItem('logged');
            }
        })
        .catch(err => console.log(err));
});