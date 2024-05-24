//localStorage.clear();
  
$(document).ready(function() {
    // Get the room number from localStorage
    var selectedRoomNumber = localStorage.getItem('selectedRoomNumber');
    if (selectedRoomNumber) {
        // Set the value of the input box
        $('#roomNumberInput').val(selectedRoomNumber);
        // Remove the room number from localStorage
        localStorage.removeItem('selectedRoomNumber');
    }
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

  // Initialize Firebase with the provided configuration details
  firebase.initializeApp(firebaseConfig)
  var db = firebase.database()

 var auth = firebase.auth()

  var user = auth.currentUser;
  

// Get a reference to the database service
/*
firebase.auth().signOut().then(function() {
    console.log('Signed Out');
  }, function(error) {
    console.error('Sign Out Error', error);
  });
*/
// Get the currently signed-in user






$('.menu-toggle').click(function() {
	$(".nav").toggleClass("mobile-nav");
	$(this).toggleClass("is-active");
});

const validRooms = [
    "27126",
    "27120",
    "27125",
    "27118",
    "27117",
    "27114C",
    "27114B",
    "27114A",
    "27113",
    "27111",
    "27112",
    "27109",
    "27108",
    "27107",
    "27104",
    "27105",
    "27101",
    "27102",
    "26119B",
    "26119A",
    "26117",
    "26110",
    "26108",
    "26111B",
    "26106",
    "26111",
    "26223",
    "26217A",
    "26211",
    "25217",
    "25202B",
    "27323",
    "27321A",
    "27321B",
    "27332",
    "27334",
    "27336",
    "27316",
    "26315B",
    "26314B",
    "26312",
    "26311",
    "26318",
    "26310",
    "26308",
    "26307",
    "26305",
    "25314",
    "25315",
    "25309",
    "27425",
    "27424",
    "27423",
    "27422",
    "27419B",
    "27419C",
    "26421",
    "26419",
    "27532",
    "27530",
    "27517",
    "27515",
    "27511",
    "26515",
    "26514",
    "26512",
    "26513",
    "26511",
    "26516",
    "26508",
    "26509",
    "26506",
    "26507",
    "26504",
    "26505",
    "26502",
    "25533",
    "330126",
    "330118",
    "330110",
    "330102",
    "400126",
    "400125",
    "400118",
    "400112",
    "400102",
    "330226",
    "330202",
    "400225",
    "400222",
    "400213",
    "400212",
    "400202"
  ];


$(document).ajaxStart(function() {
    $("body").css("cursor", "progress");
    $(":button").prop("disabled", true);
})

// Change the cursor back to 'default' and enable buttons when an AJAX request stops
.ajaxStop(function() {
    $("body").css("cursor", "default");
    $(":button").prop("disabled", false);
});

auth.onAuthStateChanged(function(user) {
    
    if (user) {
        // User is signed in, you can use the 'user' object within this scope.
        console.log(user);

        $("#goBtn").click(function(){
            var roomNumber = $("#roomNumberInput").val();
            var userId = user.uid; // Get the current user's ID
            var elevatorChecked = $("#elevator").is(":checked") ? 1 : 0;
        
            if(roomNumber.length === 5 || roomNumber.length === 6){
                if (validRooms.includes(roomNumber)){
                    localStorage.setItem('rnum', roomNumber);
                    localStorage.setItem('elevator', elevatorChecked);
        
                    // Get the current date
                    var now = new Date();
                    var year = now.getFullYear();
                    var month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JavaScript
                    var day = String(now.getDate()).padStart(2, '0');
                    var dateString = year + '.' + month + '.' + day;
        
                    // Store the room number and the current date in the user's history in Firebase
                    db.ref('users/' + userId + '/history/' + roomNumber).set({
                        roomNumber: roomNumber,
                        date: dateString,
                        timestamp: firebase.database.ServerValue.TIMESTAMP  // Add a timestamp
                    }).then(function() {
                        console.log("Room number added to history!");
                        window.location.href = 'map.html';
                    }).catch(function(error) {
                        console.log("Error: " + error.message);
                    });
                }
                else {
                    alert("Entered room number is not available!");
                }
            }
            else {
                alert("Incorrect room number format!");
            }
        });
        
    } else {
        // No user is signed in.
        console.log('No user is signed in');
        window.location.href = "login.html";
    }
});
