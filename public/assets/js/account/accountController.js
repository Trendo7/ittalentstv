app.controller('AccountController', function($scope, $http, $route, $window, AccountService) {
    $scope.isBeingEdited = false;
    $scope.isImageSaved = true;
    var database = firebase.database();
    var file = document.getElementById('fileButton');
    var avatarUploaded = false;

    if (!$scope.logged) {
        $window.location.href = '/signin.html#!/#login';
    }

    $scope.user = {};

    AccountService.getLoggedUser()
        .then(function(user) {
            $scope.$apply(function() {
                $scope.user = user;
                $scope.image = user.imageUrl;
            });
        });

    $scope.editAccount = function() {
        $scope.isBeingEdited = true;
        $scope.user.password = '';
        $scope.errorMessage = '';
        $scope.successMessage = '';
    };

    file.addEventListener('click', function() {
        document.body.onfocus = checkIt;
        $scope.$apply(function () {
            $scope.isImageSaved = false;
        });
    });

    function checkIt() {
        if (!file.value.length) {
            $scope.$apply(function () {
                $scope.isImageSaved = true;
            });
        }
        document.body.onfocus = null;
    }

    file.addEventListener('change', function(e) {
        $scope.$apply(function() {
            $scope.image = 'http://gifimage.net/wp-content/uploads/2017/09/blue-loading-gif-transparent-10.gif';
        });
        var file = e.target.files[0];
        var id = 'pic' + Date.now();
        var metadata = {
            contentType: 'image/*',
        };
        var storageRef = firebase.storage().ref('avatars/' + id);
        storageRef.put(file, metadata)
            .then(function(snapshot) {
                var imageURL = snapshot.downloadURL;
                console.log(imageURL);
                $scope.$apply(function() {
                    $scope.user.imageUrl = imageURL;
                    $scope.image = imageURL;
                    $scope.isImageSaved = true;
                });
            })
            .catch(function(data) {
                alert(data)
            })
    });

    $scope.saveChanges = function() {
        console.log('click');
        if ($scope.user.username.trim() == '') {
            $scope.errorMessage = 'Please enter username!';
            return;
        }

        if (String($scope.user.password).trim().length < 8) {
            $scope.errorMessage = 'Your password must be at least 8 characters long!';
            return;
        }

        AccountService.saveChanges($scope.user)
            .then(function(user) {
                $scope.$apply(function() {
                    $scope.isBeingEdited = false;
                    $scope.errorMessage = '';
                    $scope.logged.imageUrl = user.imageUrl;
                    $scope.successMessage = 'Your account details have been changed successfully!';
                });

            })
            .catch(function(err) {
                $scope.$apply(function() {
                    $scope.errorMessage = err.error;
                });
            });

    }

});