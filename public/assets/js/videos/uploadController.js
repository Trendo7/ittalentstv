app.controller('UploadController', function ($scope) {
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
var deleteBtn = document.getElementById('delete');
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
		},
		function error(err) {
			console.log('error');
		},
		function complete() {
			file.value = ''
			deleteBtn.style.display = 'block';
			var downloadURL = task.snapshot.downloadURL;
			var name = document.getElementById('name').value;
			var description = document.getElementById('description').value;
			writeClipData(id, name, description, downloadURL);
			var latest = document.querySelector('#latest');
			latest.innerHTML = `<iframe width="560" height="315" src="${downloadURL}" frameborder="0"  allowfullscreen></iframe>`;
		});
	})
	
})

deleteBtn.addEventListener('click', function(event) {
	var storageRef = firebase.storage().ref('videos')
	var db = firebase.database().ref('clips')
	// Create a reference to the file to delete
	var desertRef = storageRef.child(id.toString());
	var dbDelRef = db.child(id.toString());
	// Delete the file
	desertRef.delete()
		.then(function() {
			var latest = document.querySelector('#latest');
			deleteBtn.style.display = 'none'
			latest.innerHTML = '<h1>DELETED</h1>'
		})
		.catch(function(error) {
			console.log(error)
		});
	dbDelRef.remove()
})

function writeClipData(id, name, description, url) {
	firebase.database().ref('clips/' + id).set({
		id: id,
		name: name,
		description: description,
		url: url
	});
}
})