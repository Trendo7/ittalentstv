app.controller('AccountController', function($scope, $http,$route, $window, AccountService) {
    $scope.isBeingEdited = false;
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
        });
    });

    $scope.editAccount = function() {
        $scope.isBeingEdited = true;
        $scope.user.password = '';
        $scope.errorMessage = '';
        $scope.successMessage = '';
    };

    fileButton.addEventListener('change', function(e) {
        avatarUploaded = true;
        var file = e.target.files[0];
        var id = 'pic' + Date.now()
        var metadata = {
            contentType: 'image/*',
        };
        var storageRef = firebase.storage().ref('avatars/' + id)
        storageRef.put(file, metadata)
            .then(function(snapshot) {
                var imageURL = snapshot.downloadURL
                console.log(imageURL)
                $scope.user.imageUrl = imageURL;
                avatarUploaded = false;

                
            })
    })

    $scope.saveChanges = function() {
        if ($scope.user.username.trim() == '') {
            $scope.errorMessage = 'Please enter username!';
            return;
        }

        if (String($scope.user.password).trim().length < 8) {
            $scope.errorMessage = 'Your password must be at least 8 characters long!';
            return;
        }

        
            
        

        AccountService.saveChanges($scope.user)
            .then(function(d) {
                $scope.$apply(function() {
                    console.log(d)
                    $route.reload()
                    avatarUploaded = false;
                    $scope.isBeingEdited = false;
                    $scope.errorMessage = '';
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