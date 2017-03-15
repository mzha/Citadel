// Get the modal
var modal = document.getElementById('request-modal');

// Get the button that opens the modal
var btn = document.getElementById("modalButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function validateForm() {
    var file = document.forms["request"]["filename"].value;
    var name = document.forms["request"]["name"].value;
    if (file == null || file == "" || name == null || name == "") {
      alert("Please fill out empty fields");
      return false;
    }
}

function init() {
}

init();
