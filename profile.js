$('.menu-toggle').click(function() {
	$(".nav").toggleClass("mobile-nav");
	$(this).toggleClass("is-active");
});

var username = localStorage.getItem("username")
const firebaseConfig = {
    apiKey: "AIzaSyDcP60pBSlRgrSxOlBKeS1NGmg1IM8glGA",
    authDomain: "skku-map-5ee88.firebaseapp.com",
    databaseURL: "https://skku-map-5ee88-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "skku-map-5ee88",
    storageBucket: "skku-map-5ee88.appspot.com",
    messagingSenderId: "586777225468",
    appId: "1:586777225468:web:39d78a912e0e0d562f4f79"
  };
// Initialize Firebase with the provided configuration details
firebase.initializeApp(firebaseConfig)

// Get a reference to the Firebase Authentication service
var auth = firebase.auth()

// Get the currently signed-in user
const user = firebase.auth().currentUser;

// Change the cursor to 'progress' and disable buttons when an AJAX request starts
$(document).ajaxStart(function() {
		$("body").css("cursor", "progress");
		$(":button").prop("disabled", true);
	})

	// Change the cursor back to 'default' and enable buttons when an AJAX request stops
	.ajaxStop(function() {
		$("body").css("cursor", "default");
		$(":button").prop("disabled", false);
	});

$("#user-header").text(username);

// When the sign out button is clicked...
$("#signOutBtn").click(function() {
	// Sign out the user
	firebase.auth().signOut().then(() => {
		// If the sign-out was successful, clear local storage, alert the user, and redirect to the start page
		localStorage.clear();
		alert("Successfully Signed Out");
		window.location.href = 'login.html';
	}).catch((error) => {
		// If there was an error, alert the user
		alert(error.message);
	});
});

// When the authentication state changes...
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// If a user is signed in, set up a click event listener for the change password button
		$("#changePass").click(function() {
			// Create a loader and append it to the wrapper
			var wrapper = document.getElementById('wrapper')
			var loader_container = document.createElement('div')
			loader_container.setAttribute('class', 'loader_container')

			var loader = document.createElement('div')
			loader.setAttribute('class', 'loader')

			loader_container.append(loader)
			wrapper.append(loader_container)

			// Get the value of the password field
			var password = $("#password").val()
			var repassword = $("#repassword").val();

			// If the password is less than 6 characters long, alert the user and hide the loader
			if (password.length < 6) {
				alert("Password must have at least 6 characters");
				loader_container.style.display = "none";
			} else {
				if (password!=repassword) {
					alert("Passwords do not match!");
					loader_container.style.display = "none";
				}
				else {
					// Otherwise, update the user's password
				user.updatePassword(password).then(() => {
					// If the update was successful, alert the user and hide the loader
					alert("Successfully Changed the Password");
					loader_container.style.display = "none";
				}).catch((error) => {
					// If there was an error, alert the user and hide the loader
					alert(error.message);
					loader_container.style.display = "none";
				});
				}
					
				
			}
		});
	} else {
		// If no user is signed in
		window.location.href = "login.html";
	}
});