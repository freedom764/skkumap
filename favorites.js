$('.menu-toggle').click(function() {
	$(".nav").toggleClass("mobile-nav");
	$(this).toggleClass("is-active");
});

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

var favorites_content_container = document.getElementById('content-wrapper')

// Create the loader
var loader_container = document.createElement('div')
loader_container.setAttribute('class', 'loader_container')

var loader = document.createElement('div')
loader.setAttribute('class', 'loader')

loader_container.append(loader)
favorites_content_container.append(loader_container)

auth.onAuthStateChanged(function(user) {
    if (user) {
        var userId = user.uid; 

        db.ref('users/' + userId + '/favorites').on('value', function(favoritesSnapshot) {

            favorites_content_container.innerHTML = '';

            if (favoritesSnapshot.numChildren() == 0) {
                alert("No favorites found!");
                loader_container.style.display = 'none';  // Hide the loader
                return;
            }

            var favorites = Object.values(favoritesSnapshot.val());

            // Sort the favorites in numerical/alphabetical order
            favorites.sort(function(a, b) {
                return a.roomNumber.localeCompare(b.roomNumber);
            });

            favorites.forEach(function(data, index) {
                var roomNumber = data.roomNumber;

                var favorites_container = document.createElement('div');
                favorites_container.setAttribute('class', 'box');

                var roomNumberElement = document.createElement('div');
                roomNumberElement.setAttribute('class', 'details');
                roomNumberElement.innerHTML = '<span>' + roomNumber + '</span>';

                var checkboxContainer = document.createElement('div');
                checkboxContainer.setAttribute('class', 'checkbox-rect');

                var checkboxInput = document.createElement('input');
                checkboxInput.setAttribute('type', 'checkbox');
                checkboxInput.setAttribute('id', 'checkbox-rect' + index);  
                checkboxInput.setAttribute('name', 'check');
                checkboxInput.checked = true;

                var checkboxLabel = document.createElement('label');
                checkboxLabel.setAttribute('for', 'checkbox-rect' + index);  
                checkboxLabel.textContent = 'Favorite';

                checkboxContainer.append(checkboxInput, checkboxLabel);

                roomNumberElement.append(checkboxContainer);
                favorites_container.append(roomNumberElement);
                favorites_content_container.append(favorites_container);

                checkboxInput.addEventListener('change', function() {
                    $("body").css("cursor", "progress");
                    $(":button").prop("disabled", true);
                
                    if (!this.checked) {
                        db.ref('users/' + userId + '/favorites/' + roomNumber).remove().then(function() {
                            console.log("Room number removed from favorites!");
                            $("body").css("cursor", "default");
                            $(":button").prop("disabled", false);
                            favorites_container.remove();
                        }).catch(function(error) {
                            console.log("Error: " + error.message);
                        });
                    }
                });
                
            });

            favorites_content_container.scrollTop = favorites_content_container.scrollHeight;
            loader_container.style.display = 'none';
        }, function(error) {
            console.error(error);
        });

    } else {
        console.log('No user is signed in');
        window.location.href = "login.html";
    }
});
