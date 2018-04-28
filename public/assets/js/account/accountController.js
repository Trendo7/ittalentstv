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
    };

    $scope.saveChanges = function () {
        $scope.isBeingEdited = false;
        AccountService.saveChanges($scope.user).then(function (d) {

        });
    }

});