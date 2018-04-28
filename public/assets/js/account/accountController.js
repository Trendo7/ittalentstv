app.controller('AccountController', function ($scope, $http, $window, AccountService) {
    $scope.isBeingEdited = false;

    if (!$scope.logged) {
        $window.location.href = '/signin.html#!/#login';
    }

    $scope.user = {};

    AccountService.getLoggedUser().then(function (user) {
        $scope.$apply(function () {
            $scope.user = user;
        });
    });

    $scope.editAccount = function () {
        $scope.isBeingEdited = true;
        $scope.user.password = '';
        $scope.errorMessage = '';
        $scope.successMessage = '';
    };

    $scope.saveChanges = function () {
        if ($scope.user.username.trim() == '') {
            $scope.errorMessage = 'Please enter username!';
            return;
        }

        if (String($scope.user.password).trim().length < 8) {
            $scope.errorMessage = 'Your password must be at least 8 characters long!';
            return;
        }

        AccountService.saveChanges($scope.user)
            .then(function (d) {
                $scope.$apply(function () {
                    $scope.isBeingEdited = false;
                    $scope.errorMessage = '';
                    $scope.successMessage = 'Your account details have been changed successfully!';
                });
            })
            .catch(function (err) {
                $scope.$apply(function () {
                    $scope.errorMessage = err.error;
                });
            });
    }

});