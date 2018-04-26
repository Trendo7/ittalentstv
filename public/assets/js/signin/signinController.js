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
				console.log(response.data.docs)
				localStorage.setItem('logged', JSON.stringify(response.data.docs[0]));
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

		$http.post('http://localhost:3000/login', $scope.newUser)
		.then(function (response){
			if (response.status == OK) {
				console.log('OK')
			}else {
				console.log('SHIT!')
			}
		})
	}
})