app.controller('UploadController', function($scope, $http, $window,$timeout, $route) {

	if (!$scope.logged) {
		$window.location.href = '/signin.html#!/#login';
	}

	const STATUS_OK = 200;
	const STATUS_ERR = 400;
	const MAX_FILE_SIZE = 5e+6;

	$scope.hideVideo = true;

	$scope.video = {
		title: '',
		uploadedBy: {},
		description: '',
		videoUrl: '',
		tags: null,
		thumbnailUrl: ''
	}

	//function that makes screenshot of the video
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

	//create BLOB from dataUrl so we can upload it to firebase
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

	var database = firebase.database();

	var uploader = document.getElementById('uploader');
	var file = document.getElementById('fileButton');
	var deleteBtn = document.getElementById('delete-btn');
	var id;


	fileButton.addEventListener('change', function(e) {
		//get file
		var file = e.target.files[0];

		//get the file name without fake path
		var fileName = angular.element(this).val().slice(12);

		//replace the "Choose a file" label text
		angular.element(this).next('.custom-file-label').html(fileName);

		//check file size
		if (file.size > MAX_FILE_SIZE) {
			alert('MAX FILE SIZE IS 5MB! THIS IS ONLY ALERT!')

		}

		//create metadata
		var metadata = {
			contentType: 'video/mp4',
		};

		//upload file
		upload.addEventListener('click', function() {

			//setting a DATE type id for firebase
			id = Date.now();

			//creating a reference to firebase storage
			var storageRef = firebase.storage().ref('videos/' + id + '.mp4')

			//actual upload task 
			var task = storageRef.put(file, metadata);
			//update progss bar

			task.on('state_changed',
				function progress(snapshot) {
					//calculating progress and populating the progress bar
					var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					uploader.value = percentage;
					var latest = document.querySelector('#prog');
					latest.innerText = `${percentage.toFixed(0)}%`;
				},
				function error(err) {
					alert('Video uploading error occur. Try again!')
				},
				function complete() {

					var latest = document.querySelector('#prog'); //text under progress bar
					var result = document.querySelector('#result'); //container with video
					var video = document.getElementById('videoId'); //video element
					var canvas = document.getElementById('canvasId'); //canvas element
					var img = document.getElementById('imgId');
					var newVideo;
					var downloadImgUrl;

					//direct link to the video in firebase storage
					var downloadURL = task.snapshot.downloadURL;

					latest.innerText = "We are almost ready! Please wait a moment!";

					//show and load video
					$scope.hideVideo = false;
					video.src = downloadURL;

					video.onloadedmetadata = function() {
						//getting random position of the video for the screenshot * WHEN VIDEO HAS BEEN LOADED
						video.currentTime = Math.floor(Math.random() * video.duration);

						$timeout(() => {

							//create the snapshot
							var file = draw();

							//give the snapshot and id
							imageId = 'image' + Date.now();

							//creating a reference to firebase storage
							let storageRef = firebase.storage().ref('thumbnails/' + imageId + '.png');

							//actual screenshot upload
							storageRef.put(file)
								.then(function(snapshot) {

									//direct link to screenshot in firebase
									var downloadImgUrl = snapshot.downloadURL;

									//populating video object before send it to the mongoDB
									$scope.video = {
										title: $scope.title,
										uploadedBy: {},
										description: $scope.description,
										videoUrl: downloadURL,
										tags: $scope.tags.split(','),
										thumbnailUrl: downloadImgUrl,
										uploadDate: id
									}

									newVideo = $scope.video;

									//sending request to MongoDB
									$http.post('/api/videos', newVideo)
										.then(function(response) {
											if (response.status >= STATUS_OK) {
												latest.innerText = "Your video has been successfully uploaded! Yey!";
												video.currentTime = 0;
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

						}, 1500)
					};

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