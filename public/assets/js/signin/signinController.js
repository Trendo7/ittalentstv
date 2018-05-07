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

                    angular.element('#alertSuccess').html('Success registration!')
                    success.show()
                    $scope.successReg = true;

                    $timeout(function(){ 
                        success.hide()
                        $scope.successReg = false;
                        angular.element('#back').trigger('click');
                     }, 2000);

                    
                    
                    
                    

                    // $window.location.href = "/signin"
                } 

            })
            .catch (function(response){

                if (response.status == 409) {
                angular.element('#error').html(response.data.error)
                error.show()
                $scope.wrongCredentials = true;
                }
            })
    }
});