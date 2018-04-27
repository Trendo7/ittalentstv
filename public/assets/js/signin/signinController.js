app.controller('SigninController', function ($scope, $http, $location, $window) {

$scope.user = {
	username: '',
	password: ''
}

$scope.newUser = {
	username: '',
	password: '',
	email: ''
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
				console.log(response.data);
				localStorage.setItem('logged', JSON.stringify(response.data));
				alert('Zapisano v localStorage')

				// redirect to home page	

				// $window.location.href = '/'  
			}
		})

	}

	$scope.register = function () {
		
		$scope.newUser = {
			username: $scope.rUsername,
			password: $scope.rPassword,
			email: $scope.rEmail
		}

		console.log($scope.newUser)

		$http.post('http://localhost:3000/register', $scope.newUser)
		.then(function (response){
			if (response.status == OK) {
				console.log('OK')
				angular.element('#back').triggerHandler('click');
				// $window.location.href = "/signin"
			} else {
				console.log('SHIT!')
			}
		})
	}
})