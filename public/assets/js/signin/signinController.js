app.controller('SigninController', function($scope, $http, $location,$timeout, $window) {
    
    $scope.user = {
        username: '',
        password: ''
    }

    $scope.newUser = {
        username: '',
        password: '',
        email: ''
    }

    const error = angular.element('.alert-danger');
    const success = angular.element('.alert-success');

    $scope.wrongCredentials = false;
    $scope.successReg = false;


    $scope.toggleError = function() {
        error.hide()
    }

    const OK = 200;
    const USERNAME_EXISTS = 409;
    const SERVER_ERROR = 500;

    $scope.login = function() {

        $scope.user = {
            username: $scope.username,
            password: $scope.password
        };

        $http.post('/api/login', $scope.user)
            .then(function(response) {
                if (response.status == OK) {
                    console.log(response.data);
                    localStorage.setItem('logged', JSON.stringify(response.data));
                    // alert('Zapisano v localStorage')

                    // redirect to home page
                    $window.location.href = '/'
                }
            })
            .catch(function(response) {
                // alert(response.data.error)
                angular.element('#error').html(response.data.error)
                error.show()
                $scope.wrongCredentials = true;

                if (response.status == SERVER_ERROR) {
                    angular.element('#error').html('SERVER ERROR!')
                }
            })
    };

    $scope.register = function() {

        $scope.newUser = {
            username: $scope.rUsername,
            password: $scope.rPassword,
            email: $scope.rEmail,
            imageUrl: ''
        };

        console.log($scope.newUser);

        $http.post('/api/register', $scope.newUser)
            .then(function(response) {
                if (response.status == OK) {
                    console.log('OK')

                    angular.element('#alertSuccess').html('Successful registration!')
                    success.show()
                    $scope.successReg = true;

                    $timeout(function(){
                        success.hide()
                        $scope.successReg = false;
                    }, 2000)

                    angular.element('form').animate({height: "toggle", opacity: "toggle"}, "slow");
                } 

            })
            .catch (function(response){

                if (response.status == USERNAME_EXISTS) {
                angular.element('#error').html(response.data.error)
                error.show()
                $scope.wrongCredentials = true;
                }
            })
    }
});