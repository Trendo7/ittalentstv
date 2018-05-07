app.controller('SigninController', function ($scope, $http, $location, $timeout, $window) {
    const OK = 200;
    const SERVER_ERROR = 500;
    const NAME_MIN_LENGTH = 4;
    const PASSWORD_MIN_LENGTH = 8;

    $scope.user = {
        username: '',
        password: ''
    };

    $scope.newUser = {
        username: '',
        password: '',
        email: ''
    };

    $scope.wrongCredentials = '';
    $scope.successReg = '';

    $scope.closeError = function () {
        $scope.wrongCredentials = '';
    };

    $scope.login = function () {
        $scope.user = {
            username: $scope.username,
            password: $scope.password
        };

        if ((!$scope.user.username) || ($scope.user.username.trim().length < NAME_MIN_LENGTH) ||
            (!$scope.user.password) || ($scope.user.password.trim().length < PASSWORD_MIN_LENGTH)) {
            $scope.wrongCredentials = 'Oops! Wrong username or password. Try again!';
            return;
        }

        $http.post('/api/login', $scope.user)
            .then(function (response) {
                localStorage.setItem('logged', JSON.stringify(response.data));

                // redirect to home page
                $window.location.href = '/';
            })
            .catch(function (response) {
                if (response.status == SERVER_ERROR) {
                    $scope.wrongCredentials = 'SERVER ERROR!';
                } else {
                    $scope.wrongCredentials = response.data.error;
                }
            })
    };


    $scope.register = function () {
        $scope.newUser = {
            username: $scope.rUsername,
            password: $scope.rPassword,
            email: $scope.rEmail
        };

        if ((!$scope.newUser.username) || ($scope.newUser.username.trim().length < NAME_MIN_LENGTH)) {
            $scope.wrongCredentials = 'Your username must be at least ' + NAME_MIN_LENGTH + ' characters long!';
            return;
        }

        if ((!$scope.newUser.password) || ($scope.newUser.password.trim().length < PASSWORD_MIN_LENGTH)) {
            $scope.wrongCredentials = 'Your password must be at least ' + PASSWORD_MIN_LENGTH + ' characters long!';
            return;
        }

        if (!$scope.newUser.email) {
            $scope.wrongCredentials = 'Invalid Email Format!';
            return;
        }

        $http.post('/api/register', $scope.newUser)
            .then(function (response) {
                $scope.wrongCredentials = '';
                $scope.successReg = 'Successful registration!';

                $timeout(function () {
                    $scope.successReg = '';
                }, 2000);

                angular.element('form').animate({height: "toggle", opacity: "toggle"}, "slow");
            })
            .catch(function (response) {
                if (response.status == SERVER_ERROR) {
                    $scope.wrongCredentials = 'SERVER ERROR!';
                } else {
                    $scope.wrongCredentials = response.data.error;
                }
            })
    }
});