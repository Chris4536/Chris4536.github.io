// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyDhzDUw_ukDp17V2aXXpH_Wu54Xzxr68CE",
  authDomain: "chatapper-32e7c.firebaseapp.com",
  projectId: "chatapper-32e7c",
  storageBucket: "chatapper-32e7c.appspot.com",
  messagingSenderId: "500187557839",
  appId: "1:500187557839:web:c94de8f9bfe1ff54032cba",
  measurementId: "G-QME7PVT2KG"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

var database = firebase.firestore();

var feedbackHTML = document.getElementById("feedback");
var authenticationHTML = document.getElementById("screen-authentication");
var chatScreenHTML = document.getElementById("screen-chat");
var messagesHTML = document.getElementById("messages");

loadDefaultValues();

function loadDefaultValues() {
  document.getElementById("email").value = "Chris@blah.com";
  document.getElementById("password").value = "CheekyBreeki123"
}

function signup() {

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;


  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      feedbackHTML.innerHTML = "Account created";
      showChatScreen();
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
    showChatScreen();
  })
  .catch((error) => {
    feedbackHTML.innerHTML = error.message;
  });
}

function showAuthentication() {
  authenticationHTML.style.display = "block";
  chatScreenHTML.style.display = "none";
}

function showChatScreen() {
  authenticationHTML.style.display = "none";
  chatScreenHTML.style.display = "block";
  loadMessages();
}

function sendMessage() {
  var message = document.getElementById("message-input").value;
  
  createMessageHTML(message);
  




 var message_dictionary = {
   "message": message,
   "user" : firebase.auth().currentUser.email,
   "timestamp": firebase.firestore.FieldValue.serverTimestamp()
 }
 
  database.collection("channels").doc("OAoVpy03qLBJkjdSz4RB")
  .collection("messages").add(message_dictionary);
    then((docRef) => {
      
      document.getElementById("message-input").value = "";
    })
    .catch((error) => {
      console.error("Error adding document: ", error.message);
    });

  
}

function createMessageHTML(message, user, timestamp) {
  
  var messageContainerHTML = document.createElement("div");
  messageContainerHTML.classList.add("message-container");
  
  var messageHTML = document.createElement("p");
  messageHTML.innerHTML = message;
  messagesHTML.appendChild(messageHTML);

  if (user) {

    var userHTML = document.createElement("p");
    userHTML.innerHTML = message;
    messageContainerHTML.appendChild(userHTML);
  }
 
  if (timestamp) {

    var timestampHTML = document.createElement("p");
    timestampHTML.innerHTML = formatDate(timestamp.toDate());
    messageContainerHTML.appendChild(timestampHTML);
  }

  messagesHTML.appendChild(messageContainerHTML);

}


function loadMessages(){
  database.collection("channels").doc("OAoVpy03qLBJkjdSz4RB")
  .collection("messages").orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        messagesHTML.innerHTML = ""
      
        querySnapshot.forEach((doc) => {
			  	createMessageHTML(doc.data().message, doc.data().user, doc.data
          ().timestamp);
      
      });
    });
   
}



document.addEventListener("keypress", function (event) {
  var key = event.keyCode || event.which;
  if (event.keyCode == 13) {
    sendMessage();
  }
});

function formatDate(date) {
  hours = turnIntoTwoDigits(date.getHours());
  minutes = turnIntoTwoDigits(date.getMinutes());
  //seconds = turnIntoTwoDigits(date.getSeconds());
  return hours + ":" + minutes; // + ":" + seconds;
}

function turnIntoTwoDigits(n) {
  return n < 10 ? '0' + n : n;
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
