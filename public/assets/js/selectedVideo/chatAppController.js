app.controller("chat", function($scope, $firebaseArray, $location, $timeout, SelectedVideoService) {

	const ENTER_KEY = 13;

	$scope.isCommented = true;

	$scope.listenForEnter = function (keyEvent) {
        if (keyEvent.which === ENTER_KEY) {
            $scope.send();
        }
    };

	//getting video ID
	$scope.videoID = $location.search().v;
	//new chat
	$scope.newChat = {};

	//get the logged user
	$scope.user = localStorage.getItem('logged');

	//if there is logged user, add username to new chat obj
	if ($scope.user != null) {
		$scope.newChat.username = JSON.parse(localStorage.getItem('logged')).username;
		$scope.newChat.userId = JSON.parse(localStorage.getItem('logged')).userId;
		$scope.newChat.imageUrl = JSON.parse(localStorage.getItem('logged')).imageUrl;
	}

	// Create firebase ref 
	var ref = new Firebase("https://ittalentstv-3.firebaseio.com/" + $scope.videoID);

	// Bind (three-way // view-controller-firebase)
	$scope.chats = $firebaseArray(ref);

	$timeout(function(){
		if ($scope.chats.length == 0) {
		$scope.isCommented = false;
		}
	}, 1500)

	// Add new chat message
	$scope.send = function() {
		// Add time to new chat
		$scope.newChat.time = (new Date).getTime();
		// Add it to firebase db
		$scope.chats.$add($scope.newChat);
		//Reset msg
		$scope.newChat.msg = '';
		$scope.isCommented = true;
	}
});