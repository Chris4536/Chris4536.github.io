var feedbackHTML = document.getElementById("feedback");
var authenticationHTML = document.getElementById("authentication");


function signup() {

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;


  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      feedbackHTML.innerHTML = "Account created";
      hideAuthentication();
  })
  .catch((error) => {
    feedbackHTML.innerHTML = error.message;
  });

}

function login() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    feedbackHTML.innerHTML = "Login success";
    hideAuthentication();
  })
  .catch((error) => {
    feedbackHTML.innerHTML = error.message;
  });
}

function showAuthentication() {
  authenticationHTML.style.display = "block";

}

function hideAuthentication() {
  authenticationHTML.style.display = "none";
}







function loadChannels() {
  database.collection("channels").orderBy("name")
}


function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}
