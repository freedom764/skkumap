var username = localStorage.getItem("username")
if (!username) {
  window.location.href = "login.html";
}




$('.menu-toggle').click(function() {
	$(".nav").toggleClass("mobile-nav");
	$(this).toggleClass("is-active");
});

$('#showMap').click(function(e) {
    e.preventDefault();
    $('#map1').show();
    $('#map2').hide();
    $('#map3').hide();
});

$('#firstMap').click(function(e) {
    e.preventDefault();
    $('#map1').hide();
    $('#map2').show();
    $('#map3').hide();
});

$('#destMap').click(function(e) {
    e.preventDefault();
    $('#map1').hide();
    $('#map2').hide();
    $('#map3').show();
});





// API 호출을 위한 함수
function callAPI() {
    // API 호출
    
    roomNumber = localStorage.getItem('rnum');
    elevatorChecked = localStorage.getItem('elevator');
    
    
    
    buildingNumbers = ["25", "26", "27", "330", "400"];

    buildingNumber = buildingNumbers.find(num => roomNumber.startsWith(num));
    floorNumber = roomNumber.slice(buildingNumber.length, buildingNumber.length + 1);
  

    console.log("sendrequest called");
    fetch('http://3.38.208.78:8000/api/v1/find', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
            destination_room: roomNumber
        }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // JSON 형식으로 응답을 파싱합니다.
      })
      .then(data => {
        // API 응답 데이터를 받아옵니다.
        var links;
        var floorNumber = parseInt(roomNumber.slice(buildingNumber.length, buildingNumber.length + 1));
        
        var floorNames = ["First", "Second", "Third", "Fourth", "Fifth"];
        var floorName = floorNames[floorNumber - 1]; // Get the name of the floor
    
        if (floorNumber === 1) {
            links = data.stair.filter(link => link !== ""); // Filter out empty strings
            enrNum = data.entrance_id.stair;
            $('#destMap').hide(); // Hide the destination floor button
        } else {
            if (elevatorChecked==1) {
              links = data.elevator.filter(link => link !== ""); // Filter out empty strings
              enrNum = data.entrance_id.elevator;
            }
            else {
              links = data.stair.filter(link => link !== ""); // Filter out empty strings
              enrNum = data.entrance_id.stair;
            }
           
            $('#destMap').show(); // Show the destination floor button
            $('#floorText').text(floorName + ' Floor'); // Update the button text
        }
        
        var imageUrl1 = links[0]; // Get the first link
        var imageUrl2 = links[1]; // Get the second link

        var viewer1 = OpenSeadragon({
          id: "map2",
          prefixUrl: "openseadragon-bin-4.1.1/images/",
          tileSources: {
              type: 'image',
              url:  imageUrl1
          }
      });

      // Create a new OpenSeadragon viewer for the second image
      var viewer2 = OpenSeadragon({
          id: "map3",
          prefixUrl: "openseadragon-bin-4.1.1/images/",
          tileSources: {
              type: 'image',
              url:  imageUrl2
          }
      });

        //95 - https://kko.to/u17nawHQUk
        //96 - https://kko.to/ihB9ok0nVU
        //97 - https://kko.to/T4yDkYnUxf
        //98 - https://kko.to/5wU5vvOGK6
        //99 - https://kko.to/_6fyO3I0wn
        //0 - https://kko.to/sTrTQThwuo
        //28 - https://kko.to/ykJoS2EwOh
        //51 - https://kko.to/-KIpmnPovB

        var iframe0 = document.getElementById('map1');
        var enrNumInt = parseInt(enrNum, 10);
        switch(enrNumInt) {
          case 0:
              iframe0.src = "https://kko.to/sTrTQThwuo";
              break;
          case 28:
              iframe0.src = "https://kko.to/ykJoS2EwOh";
              break;
          case 51:
              iframe0.src = "https://kko.to/-KIpmnPovB";
              break;
          case 95:
              iframe0.src = "https://kko.to/u17nawHQUk";
              break;
          case 96:
              iframe0.src = "https://kko.to/ihB9ok0nVU";
              break;
          case 97:
              iframe0.src = "https://kko.to/T4yDkYnUxf";
              break;
          case 98:
              iframe0.src = "https://kko.to/5wU5vvOGK6";
              break;
          case 99:
              iframe0.src = "https://kko.to/_6fyO3I0wn";
              break;
          default:
              console.log("No matching case for enrNum: " + enrNum);
              break;
      }
        
        console.log("setting room number"+roomNumber);
    })
    
    
    
    
      .catch(error => {
        // 에러 처리
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  callAPI();