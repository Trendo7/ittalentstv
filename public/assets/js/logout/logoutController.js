app.controller('LogoutController', function ($scope, $http, $location, $window) {
    const OK = 200;


    $http.get('http://localhost:3000/logout')
        .then(function (response) {
            if (response.status == OK) {
                console.log(response.data);
                localStorage.removeItem('logged');

            }
        })
});