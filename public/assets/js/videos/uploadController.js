
app.controller('UploadController', function ($scope, $http, $window, $route) {


if (!$scope.logged) {
        $window.location.href = '/signin.html#!/#login';
	}

const STATUS_OK = 200;
const STATUS_ERR = 400;
const MAX_FILE_SIZE = 5e+6;

	$scope.video = {
		title: '',
		uploadedBy: {},
		description: '',
		videoUrl: '',
		tags: null,
		thumbnailUrl: ''
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

var database = firebase.database();

var uploader = document.getElementById('uploader');
var file = document.getElementById('fileButton');
var deleteBtn = document.getElementById('delete-btn');
var id;


fileButton.addEventListener('change', function(e) {
	 
	//get file
	var file = e.target.files[0];

    //get the file name
    var fileName = angular.element(this).val().slice(12);

    //replace the "Choose a file" label
    angular.element(this).next('.custom-file-label').html(fileName);
            
	//create storage ref
	if (file.size > MAX_FILE_SIZE) {
		alert('MAX FILE SIZE IS 5MB! THIS IS ONLY ALERT!')
		
	}
	//upload file
	var metadata = {
		contentType: 'video/mp4',
	};

	

	upload.addEventListener('click', function () {
		id = Date.now();
	var storageRef = firebase.storage().ref('videos/' + id + '.mp4')
		var task = storageRef.put(file, metadata);
	//update progss bar
	task.on('state_changed',
		function progress(snapshot) {
			var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			uploader.value = percentage;

			var latest = document.querySelector('#prog');
			latest.innerText = `${percentage.toFixed(0)}%`;
		},
		function error(err) {
			console.log('error');
		},
		function complete() {
			
			var downloadURL = task.snapshot.downloadURL;


			$scope.video = {
				title: $scope.title,
				uploadedBy: {},
				description: $scope.description,
				videoUrl: downloadURL,
				tags: $scope.tags.split(','),
				thumbnailUrl: 'http://videopromotion.club/assets/images/default-video-thumbnail.jpg'
			}

			console.log(document.getElementById('tags').value)
			var newVideo = $scope.video


			console.log(newVideo)
			$http.post('http://localhost:3000/videos', newVideo)
			.then(function (response) {
				if (response.status >= STATUS_OK) {
					console.log('zapisano v bazata')
					var latest = document.querySelector('#prog');
					latest.innerText = "Your clip was successfully uploaded!";
					setTimeout(function(){


						// трябва да препратим юзъра директно към видеото след 3 сек и да му го отвори в 
						// нов прозорец чрез смяна на URL при който да се задейства CurrentVideoController 
						// (трябва ни IDто на видеото от монго)
					        // $window.location.href = '/signin.html#!/#login';
						



					latest.innerHTML = `<div class="row mt-2"><div class="col-lg-8 col-md-12 embed-responsive embed-responsive-16by9 mx-auto">
										<video class="embed-responsive-item" src="${downloadURL}" controls controlsList="nodownload"></video></div>`	
					},3000)
					
					
				}
			})
			.catch(function(err){
				console.log(id)
				
				var storageRef = firebase.storage().ref('videos')			
				// Create a reference to the file to delete
				var desertRef = storageRef.child(id.toString() + ".mp4");
				console.log(desertRef)
				// Delete the file
				setTimeout(function(){
				desertRef.delete()
					.then(function() {
						var latest = document.querySelector('#prog');
						latest.innerText = 'Sign in first!'
					})
				}, 1000)	
			})
			
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