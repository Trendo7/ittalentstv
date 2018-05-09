app.controller("chat", function($scope, $firebaseArray, $location, SelectedVideoService) {

	//getting video ID
	$scope.videoID = $location.search().v;
	//new chat
	$scope.newChat = {};

	//get the logged user
	$scope.user = localStorage.getItem('logged');

	//if there is logged user, add username to new chat obj
	if ($scope.user != null) {
		$scope.newChat.username = JSON.parse(localStorage.getItem('logged')).username
	}

	// Create firebase ref 
	var ref = new Firebase("https://ittalentstv-3.firebaseio.com/" + $scope.videoID);

	// Bind (three-way // view-controller-firebase)
	$scope.chats = $firebaseArray(ref);

	// Add new chat message
	$scope.send = function() {
		// Add time to new chat
		$scope.newChat.time = (new Date).getTime();
		// Add it to firebase db
		$scope.chats.$add($scope.newChat);
		//Reset msg
		$scope.newChat.msg = '';
	}
});