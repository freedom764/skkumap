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
firebase.initializeApp(firebaseConfig)
var auth = firebase.auth()
var user = firebase.auth().currentUser;
var db = firebase.database()

var forum_content_container = document.getElementById('content-wrapper')
var loader_container = document.createElement('div')
loader_container.setAttribute('class', 'loader_container')

var loader = document.createElement('div')
loader.setAttribute('class', 'loader')

loader_container.append(loader)
forum_content_container.append(loader_container)

var forum_container = document.createElement('div');
forum_content_container.append(forum_container);

// Listen for changes in the 'posts' node of the Firebase Realtime Database
auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in, you can use the 'user' object within this scope.
        console.log(user);

        var userId = user.uid; // Get the current user's ID

        // Listen for changes in the 'history' node of the Firebase Realtime Database
        db.ref('users/' + userId + '/history').on('value', function(historySnapshot) {

            forum_container.innerHTML = '';

            if (!historySnapshot.exists() || historySnapshot.numChildren() == 0) {
                alert("No searched rooms found!");
                loader_container.style.display = 'none';  // Hide the loader
                return;
            }

            var history = Object.values(historySnapshot.val());
            history.sort(function(a, b) {
                return b.timestamp - a.timestamp;
            });
            // Loop through the history
            history.forEach(function(data, index) {
                var roomNumber = data.roomNumber;
                var date = data.date;

                var history_container = document.createElement('div');
                history_container.setAttribute('class', 'box');

                var roomNumberElement = document.createElement('div');
                roomNumberElement.setAttribute('class', 'details');
                var roomNumberText = document.createElement('span');
                roomNumberText.textContent = roomNumber;
                roomNumberElement.appendChild(roomNumberText);

                roomNumberText.addEventListener('click', function() {
                    // Store the room number in localStorage
                    localStorage.setItem('selectedRoomNumber', roomNumber);
                    // Redirect to home.html
                    window.location.href = 'home.html';
                });

                // Create the div container
                var checkboxContainer = document.createElement('div');
                checkboxContainer.setAttribute('class', 'checkbox-rect');

                // Create the input (checkbox)
                var checkboxInput = document.createElement('input');
                checkboxInput.setAttribute('type', 'checkbox');
                checkboxInput.setAttribute('id', 'checkbox-rect' + index);  
                checkboxInput.setAttribute('name', 'check');

                // Create the label
                var checkboxLabel = document.createElement('label');
                checkboxLabel.setAttribute('for', 'checkbox-rect' + index);  // Make sure the 'for' attribute matches the unique id
                checkboxLabel.textContent = 'Favorite';

                // Append the checkbox and label to the container
                checkboxContainer.append(checkboxInput, checkboxLabel);

                db.ref('users/' + userId + '/favorites/' + roomNumber).once('value', function(snapshot) {
                    if (snapshot.exists()) {
                        // If the room number is in the user's favorites, set the checkbox to be checked
                        checkboxInput.checked = true;
                    }
                });

                var dateElement = document.createElement('div');
                dateElement.setAttribute('class', 'sub-details');
                dateElement.textContent = date;
                roomNumberElement.append(dateElement, checkboxContainer);
                history_container.append(roomNumberElement);
                forum_content_container.append(history_container);
                checkboxInput.addEventListener('change', function() {
                    // Disable the page while fetching or deleting data
                    $("body").css("cursor", "progress");
                    $(":button").prop("disabled", true);
                
                    if (this.checked) {
                        // If the checkbox is checked, save the room number to the user's favorites
                        db.ref('users/' + userId + '/favorites/' + roomNumber).set({
                            roomNumber: roomNumber
                        }).then(function() {
                            console.log("Room number added to favorites!");
                            // Re-enable the page after the operation is complete
                            $("body").css("cursor", "default");
                            $(":button").prop("disabled", false);
                        }).catch(function(error) {
                            console.log("Error: " + error.message);
                        });
                    } else {
                        // If the checkbox is unchecked, remove the room number from the user's favorites
                        db.ref('users/' + userId + '/favorites/' + roomNumber).remove().then(function() {
                            console.log("Room number removed from favorites!");
                            // Re-enable the page after the operation is complete
                            $("body").css("cursor", "default");
                            $(":button").prop("disabled", false);
                        }).catch(function(error) {
                            console.log("Error: " + error.message);
                        });
                    }
                });
                
            });

            forum_content_container.scrollTop = forum_content_container.scrollHeight;
            loader_container.style.display = 'none';
        }, function(error) {
            console.error(error);
        });

    } else {
        // No user is signed in.
        console.log('No user is signed in');
        window.location.href = "login.html";
    }
});

