app.controller('UploadController', function ($scope, $http) {


	$scope.video = {
		title: '',
		uploadedBy: {},
		description: '',
		videoUrl: '',
		thumbnailUrl: ''
	}



	// Initialize Firebase
var config = {
	apiKey: "AIzaSyA0knIwOFNWkJDRcxSwL6n6uXj3C-LqcpI",
	authDomain: "simple-upload-prj.firebaseapp.com",
	databaseURL: "https://simple-upload-prj.firebaseio.com",
	projectId: "simple-upload-prj",
	storageBucket: "simple-upload-prj.appspot.com",
	messagingSenderId: "221421093893"
};
firebase.initializeApp(config);

var database = firebase.database();

var uploader = document.getElementById('uploader');
var file = document.getElementById('fileButton');
var deleteBtn = document.getElementById('delete-btn');
var id;

fileButton.addEventListener('change', function(e) {
	//get file
	var file = e.target.files[0];
	//create storage ref
	id = Date.now();
	var storageRef = firebase.storage().ref('videos/' + id + '.mp4')
	//upload file
	var metadata = {
		contentType: 'video/mp4',
	};

	upload.addEventListener('click', function () {
		var task = storageRef.put(file, metadata);
	//update progss bar
	task.on('state_changed',
		function progress(snapshot) {
			var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			uploader.value = percentage;
			var latest = document.querySelector('#latest');
			latest.innerHTML = `<h3 class="mx-auto">${percentage.toFixed(0)}%</h3>`;
		},
		function error(err) {
			console.log('error');
		},
		function complete() {
			
			var downloadURL = task.snapshot.downloadURL;

			console.log(task.snapshot)
			

			$scope.video = {
				title: $scope.title,
				uploadedBy: {},
				description: $scope.description,
				videoUrl: downloadURL,
				thumbnailUrl: 'http://videopromotion.club/assets/images/default-video-thumbnail.jpg'
			}

			console.log($scope.video)

			var newVideo = $scope.video



			$http.post('http://localhost:3000/videos', newVideo)
			.then(function (response) {
				if (response.status == 200) {
					console.log('zapisano v bazata')
				}
			})

			
			var latest = document.querySelector('#latest');
			latest.innerHTML = "<h1> UPLOADED </h1>";
		});
	})
	
})

// deleteBtn.addEventListener('click', function(event) {
// 	var storageRef = firebase.storage().ref('videos')
// 	var db = firebase.database().ref('clips')
// 	// Create a reference to the file to delete
// 	var desertRef = storageRef.child(id.toString());
// 	var dbDelRef = db.child(id.toString());
// 	// Delete the file
// 	desertRef.delete()
// 		.then(function() {
// 			var latest = document.querySelector('#latest');
// 			deleteBtn.style.display = 'none'
// 			latest.innerHTML = '<h1>DELETED</h1>'
// 		})
// 		.catch(function(error) {
// 			console.log(error)
// 		});
// 	dbDelRef.remove()
// })

// function writeClipData(id, name, description, url) {
// 	firebase.database().ref('clips/' + id).set({
// 		id: id,
// 		name: name,
// 		description: description,
// 		url: url
// 	});
// }
})