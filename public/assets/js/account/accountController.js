app.controller('AccountController', function($scope, $http, $route, $window, AccountService) {
    $scope.isBeingEdited = false;
    $scope.isImageSaved = true;
    const MAX_AVATAR_SIZE = 3e+6;
    var database = firebase.database();
    var file = document.getElementById('fileButton');

    if (!$scope.logged) {
        $window.location.href = '/signin.html#!/#login';
    }

    $scope.user = {};
    $scope.alert = true;

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
        $scope.$apply(function() {
            $scope.isImageSaved = false;
        });
    });

    function checkIt() {
        if (!file.value.length) {
            $scope.$apply(function() {
                $scope.isImageSaved = true;
            });
        }
        document.body.onfocus = null;
    }

    file.addEventListener('change', function(e) {
        var file = e.target.files[0];

        if (file.size > MAX_AVATAR_SIZE) {
            $scope.$apply(function(){
                $scope.alert = false;
        })
            angular.element('#profilePic').hide()
            angular.element('#error').html('Max file size is 20MB!')
            angular.element(this).val(null);
            angular.element('#fileName').html('Select file...')
            return;
        } else {
            $scope.$apply(function(){
                $scope.alert = true;
            })
            angular.element('#profilePic').show()
        }

        if (file != undefined) {

            $scope.$apply(function() {
                $scope.image = '../assets/img/loading.gif';
            });

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
        }
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
                    $scope.logged.username = user.username;
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