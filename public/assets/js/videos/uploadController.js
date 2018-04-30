app.controller('UploadController', function($scope, $http, $window, $route) {


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

	function draw() {
		var video = document.getElementById('videoId')
		var canvas = document.getElementById('canvasId');
		var img = document.getElementById('imgId');
		var context = canvas.getContext('2d');
		context.drawImage(video, 0, 0, canvas.width, canvas.height);
		var dataURL = canvas.toDataURL('image/jpeg', 1.0);
		img.src = dataURL;
		return dataURItoBlob(dataURL)
	}


	var dataURItoBlob = function(dataURI) {
		var array, binary, i;
		binary = atob(dataURI.split(",")[1]);
		array = [];
		i = 0;
		while (i < binary.length) {
			array.push(binary.charCodeAt(i));
			i++;
		}
		return new Blob([new Uint8Array(array)], {
			type: "image/png"
		});
	};

	

	// Initialize Firebase
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyAUHckBJlquo3NQzXQ88Trhs6P-gFo_4SM",
		authDomain: "videotalentstv-2.firebaseapp.com",
		databaseURL: "https://videotalentstv-2.firebaseio.com",
		projectId: "videotalentstv-2",
		storageBucket: "videotalentstv-2.appspot.com",
		messagingSenderId: "165285487985"
	};
	
	firebase.initializeApp(config);

	var database = firebase.database();

	var uploader = document.getElementById('uploader');
	var file = document.getElementById('fileButton');
	var deleteBtn = document.getElementById('delete-btn');
	var id;

	var flag;


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



		upload.addEventListener('click', function() {

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

					var newVideo;
					var downloadImgUrl;
					var downloadURL = task.snapshot.downloadURL;
					

					var latest = document.querySelector('#prog');
					var result = document.querySelector('#result')
					latest.innerText = "Your clip was successfully uploaded!";

					result.innerHTML = `<div class="row mt-2"><div class="col-lg-8 col-md-12 embed-responsive embed-responsive-16by9 mx-auto">
										<video id="videoId" crossorigin="anonymous" class="embed-responsive-item" src="${downloadURL}" controls controlsList="nodownload"></video></div>`

					var video = document.getElementById('videoId')
					var canvas = document.getElementById('canvasId');
					var img = document.getElementById('imgId');

					video.currentTime = 10;
					

					setTimeout(() => {
					
						var file = draw()
						id = 'image' + Date.now()
						let storageRef = firebase.storage().ref('thumbnails/' + id + '.png')
						storageRef.put(file)
							.then(function(snapshot) {
								var downloadImgUrl = snapshot.downloadURL
								console.log(downloadImgUrl)
								$scope.video = {
									title: $scope.title,
									uploadedBy: {},
									description: $scope.description,
									videoUrl: downloadURL,
									tags: $scope.tags.split(','),
									thumbnailUrl: downloadImgUrl
								}
								newVideo = $scope.video;

								$http.post('http://localhost:3000/videos', newVideo)
									.then(function(response) {
										if (response.status >= STATUS_OK) {
											console.log('zapisano v bazata')

										}
									})
									.catch(function(err) {
										console.log(id)

										var storageRef = firebase.storage().ref('videos')
										// Create a reference to the file to delete
										var desertRef = storageRef.child(id.toString() + ".mp4");
										console.log(desertRef)
										// Delete the file
										setTimeout(function() {
											desertRef.delete()
												.then(function() {
													var latest = document.querySelector('#prog');
													latest.innerText = 'Sign in first!'
												})
										}, 3000)
									})
							});
					}, 4000)

				});

		})
if (!firebase.apps.length) {
    firebase.initializeApp({});
	}
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