app.controller('MainController', function($scope, $rootScope, $http, $location, $window) {
    (function() {
        if ($rootScope.logged != JSON.parse(localStorage.getItem('logged'))) {
            $rootScope.logged = JSON.parse(localStorage.getItem('logged'));
        }

        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyCIsC29eahBX2CgCAscvwj_9Z08mdAFHeI",
            authDomain: "ittalentstv-3.firebaseapp.com",
            databaseURL: "https://ittalentstv-3.firebaseio.com",
            projectId: "ittalentstv-3",
            storageBucket: "ittalentstv-3.appspot.com",
            messagingSenderId: "559863242330"
        };
        firebase.initializeApp(config);
    })();

    const OK = 200;

    $rootScope.logout = function() {
        $http.get('http://localhost:3000/logout')
            .then(function(response) {
                if (response.status == OK) {
                    console.log(response.data);
                    localStorage.removeItem('logged');
                    $window.location.href = '/';
                }
            })
    };

    //opens selected video
    $scope.openVideoLink = function (video) {
        $location.path(video._id);
    };

    //opens list with videos uploaded by selected user
    $scope.openUserLink = function (video) {
        $location.path('user/' + video.uploadedByID);
    };
});