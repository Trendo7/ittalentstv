app.controller('SigninController', function ($scope, $http, $location, $window) {

$scope.user = {
	username: '',
	password: ''
}

const OK = 200;

	$scope.login = function () {

		$scope.user = {
			username: $scope.username,
			password: $scope.password
		}

		$http.post('http://localhost:3000/login', $scope.user)
		.then(function (response){
			if (response.status == OK) {
				$window.location.href = '/'
			}
		})

	}
})