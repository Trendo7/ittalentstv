app.controller('MainController', function($scope, $rootScope, $http, $location, $window) {
    (function () {
        if ($rootScope.logged != JSON.parse(localStorage.getItem('logged'))) {
            $rootScope.logged = JSON.parse(localStorage.getItem('logged'));
        }

        // Initialize Firebase
 var config = {
    apiKey: "AIzaSyCIhpw08oRhdBRaSIma-2h96d_BRYQ0QMA",
    authDomain: "videotalents-d652e.firebaseapp.com",
    databaseURL: "https://videotalents-d652e.firebaseio.com",
    projectId: "videotalents-d652e",
    storageBucket: "videotalents-d652e.appspot.com",
    messagingSenderId: "200617454566"
  };
        firebase.initializeApp(config);
    })();

    const OK = 200;

    $rootScope.logout = function () {
        $http.get('/api/logout')
            .then(function (response) {
                if (response.status == OK) {
                    localStorage.removeItem('logged');
                    $window.location.href = '/';
                }
            })
            .catch(err => reject(err));
    };


    //opens selected video
    $scope.openVideoLink = function(video) {
        $location.url('watch?v=' + video._id);
    };

    //opens list with videos uploaded by selected user
    $scope.openUserLink = function(video) {
        $location.url('user/' + video.uploadedByID);
    };

    //opens playlist
    $scope.openPlaylistLink = function(playlist) {
        $location.url('watch?v=' + playlist.videos[0] + '&list=' + playlist._id);
    };

    /*We store the url when SIGN IN is clicked. Then when users log in,
    we redirect them to the page where they were before clicking the SIGN IN button.*/
    $scope.signinRedirect = function () {
        var path = $location.url();
        $window.sessionStorage.setItem('returnPath', path);
    }
});