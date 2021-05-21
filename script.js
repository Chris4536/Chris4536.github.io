var firebaseConfig = {
  apiKey: "AIzaSyDhzDUw_ukDp17V2aXXpH_Wu54Xzxr68CE",
  authDomain: "chatapper-32e7c.firebaseapp.com",
  projectId: "chatapper-32e7c",
  storageBucket: "chatapper-32e7c.appspot.com",
  messagingSenderId: "500187557839",
  appId: "1:500187557839:web:c94de8f9bfe1ff54032cba",
  measurementId: "G-QME7PVT2KG"
  
};

var fileInput = document.getElementById("file-input");
var inputEmail = document.getElementById("input-email");
var inputPassword = document.getElementById("input-password");

var sidebarHTML = document.getElementById("sidebar");
var channelsHTML = document.getElementById("channels");
var chatHeader = document.getElementById("chat-header");
var chatTitle = document.getElementById("chat-header-title");
var screenAuthentication = document.getElementById("screen-authentication");
var buttonLogin = document.getElementById("button-login");
var buttonSignup = document.getElementById("button-signup");
var buttonShowSignup = document.getElementById("button-show-signup");
var buttonShowLogin = document.getElementById("button-show-login");
var buttonLogout = document.getElementById("button-logout");

var chatHTML = document.getElementById("screen-chat");
var messagesHTML = document.getElementById("chat-messages");
var messageInput = document.getElementById("message-input");
var feedbackHTML = document.getElementById("feedback");
var checkboxes = document.getElementsByName("searchCheckbox");
var sortRadioButtons = document.getElementsByName("sortCheckbox");


firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.firestore();
var storage = firebase.storage().ref();

var currentChannelId = "ApbX3evKi1bRq65KMiMH";
var currentChannelMessagesData = [];
var checkboxArray = [];
var sortRadiobuttonStore = "";

loadDefaultValues();
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    showChat();
  } else {
    showAuthentication();
  }
});

function logout() {
  firebase.auth().signOut()
    .then(function() {
      feedbackHTML.innerHTML = "Logged out succesfully!";
      buttonLogout.style.display = "none";
      inputEmail.value = "";
      inputPassword.value = "";      
    })
    .catch(function(error) {
      feedbackHTML.innerHTML = error.message;
    });
}

function toggleTheme() {
  if (document.body.classList.contains("dark-theme")) {
    document.body.classList.remove("dark-theme");
  } else {
    document.body.classList.add("dark-theme");
  }
}

function toggleSidebar() {
  sidebarHTML.classList.toggle("active");
}

function loadDefaultValues() {
  inputEmail.value = "blah@test.app";
  inputPassword.value = "SAFe123!";
}

function resetFeedback() {
  feedbackHTML.classList.remove("feedback-error");
  feedbackHTML.innerHTML = "";
}

function showAuthentication() {
  screenAuthentication.style.display = "flex";
  chatHTML.style.display = "none";
  chatHeader.style.display = "none";

  feedback.innerHTML = "";
}

function showChat() {
  screenAuthentication.style.display = "none";
  chatHTML.style.display = "flex";
  chatHeader.style.display = "flex";

  loadChannels();
  // loadMessages();
}

function showSignup() {
  buttonLogin.style.display = "none";
  buttonShowSignup.style.display = "none";
  buttonSignup.style.display = "inline-block";  
  buttonShowLogin.style.display = "inline-block";
  buttonLogout.style.display = "none";
}

function showLogin() {
  buttonSignup.style.display = "none";
  buttonShowLogin.style.display = "none";
  buttonLogin.style.display = "inline-block";
  buttonShowSignup.style.display = "inline-block"; 
  buttonLogout.style.display = "inline-block";
}

function monitorCheckboxes(){
  checkboxArray = [];
  for (var checkbox of checkboxes){
    if (checkbox.checked === true)
      checkboxArray.push(checkbox.value);
  }
}

function monitorRadioButtons(){

  for (var radiobutton of sortRadioButtons){
    if (radiobutton.checked === true){
      sortRadiobuttonStore = radiobutton.value;
  
    }  
  }
}


function searchInChannel(text) {  
  messagesHTML.innerHTML = "";
  monitorCheckboxes();
  monitorRadioButtons();

  if (checkboxArray.length === 2 ||checkboxArray.length === 0){
    currentChannelMessagesData.forEach(function (messageData) {
    if (messageData.message.indexOf(text) != -1 || messageData.user.indexOf(text) != -1) {
      createMessageHTML(messageData);
    }
  });
  }else if (checkboxArray.length === 1 && checkboxArray[0] === "message"){
     currentChannelMessagesData.forEach(function (messageData) {
    if (messageData.message.indexOf(text) != -1) {
      createMessageHTML(messageData);
    }
  });
  }else if (checkboxArray.length === 1 && checkboxArray[0] === "user"){
     currentChannelMessagesData.forEach(function (messageData) {
    if (messageData.user.indexOf(text) != -1) {
      createMessageHTML(messageData);
    }
  });
  }else{
    messagesHTML.scrollTop = messagesHTML.scrollHeight;
  }
}

function loadMessages(channelId) {
  currentChannelMessagesData = [];
 
    database.collection("channels").doc(channelId).collection("messages").orderBy("timestamp", "asc")
    .onSnapshot((querySnapshot) => {
      messagesHTML.innerHTML = "";
      querySnapshot.forEach((doc) => {
        currentChannelMessagesData.push(doc.data());
        createMessageHTML(doc.data());
      });
      messagesHTML.scrollTop = messagesHTML.scrollHeight;
    });
}
  

function loadChannels() {
  database.collection("channels").orderBy("name")
    .onSnapshot((querySnapshot) => {
      channelsHTML.innerHTML = "";
      querySnapshot.forEach((doc) => {
        // console.log(doc.data().name + ",id=" + doc.id);
        createChannelForSidebarHTML(doc.id, doc.data().name);
      });
      loadMessages(currentChannelId);
    });
}

function createChannelForSidebarHTML(id, name) {
  var channelHTML = document.createElement("a");
  channelHTML.href = "#";
  channelHTML.id = id;
  channelHTML.innerHTML = "#" + name;
  channelHTML.onclick = function() {
    currentChannelId = id;
    loadMessages(id);
  }

  var listItemHTML = document.createElement("li");
  listItemHTML.appendChild(channelHTML);
  channelsHTML.appendChild(listItemHTML);
}

function checkForImage(message) {
  //return (message.indexOf(".jpg") != -1);
  return (message.match(/\.(jpeg|jpg|gif|png)/i) != null);
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function createMessageHTML(data) {
  var messageBubbleHTML = document.createElement("div");
  messageBubbleHTML.classList.add("chat-bubble");  

  var messageContainerHTML = document.createElement("div");
  messageContainerHTML.classList.add("message-container");

  var messageHTML;  
  if (validURL(data.message)) {
    messageHTML = document.createElement("a");
    messageHTML.href = data.message;
  } else {
    messageHTML = document.createElement("p");
  }   
  messageHTML.classList.add("message-content");  

  if (checkForImage(data.message)) {
    var imageHTML = document.createElement("img");
    imageHTML.src = data.message;
    imageHTML.classList.add("img-fluid");
    messageContainerHTML.appendChild(imageHTML);
  }

  messageHTML.innerHTML = data.message;
  messageContainerHTML.appendChild(messageHTML);  

  var messageInfoHTML = document.createElement("div");
  messageInfoHTML.classList.add("message-info");

  if (data.user) {
    if (data.user == firebase.auth().currentUser.email) {
      messageContainerHTML.classList.add("message-mine");
    } else {
      var userHTML = document.createElement("p");
      userHTML.innerHTML = data.user;
      userHTML.classList.add("message-user");
      messageInfoHTML.appendChild(userHTML);
    }    
  }  
  
  var timestampParagraphHTML = document.createElement("p");
  timestampParagraphHTML.classList.add("message-timestamp");
  if (data.timestamp) {
    var date = data.timestamp.toDate();
    timestampParagraphHTML.innerHTML = formatDate(date);    
  } else {
    timestampParagraphHTML.innerHTML = "..."
  }
  messageInfoHTML.appendChild(timestampParagraphHTML);
  messageContainerHTML.appendChild(messageInfoHTML);

  messageBubbleHTML.appendChild(messageContainerHTML);
  messagesHTML.appendChild(messageBubbleHTML);
}

function formatDate(date) {
  hours = turnIntoTwoDigits(date.getHours());
  minutes = turnIntoTwoDigits(date.getMinutes());
  //seconds = turnIntoTwoDigits(date.getSeconds());
  return hours + ":" + minutes; // + ":" + seconds;
}

function turnIntoTwoDigits(n) {
  return n < 10 ? '0' + n : n;
}

function signup() {
  resetFeedback();
  var email = inputEmail.value;
  var password = inputPassword.value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var message = "Welcome " + userCredential.user.email + "!";
      feedbackHTML.innerHTML = message;
      showChat();
    })
    .catch((error) => {
      feedbackHTML.innerHTML = error.message;
      feedbackHTML.classList.add("feedback-error");
    });
}

function login() {
  resetFeedback();
  var email = inputEmail.value;
  var password = inputPassword.value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var message = "Welcome " + userCredential.user.email + "!";
      feedbackHTML.innerHTML = message;
      showChat();
    })
    .catch((error) => {
      feedbackHTML.innerHTML = error.message;
      feedbackHTML.classList.add("feedback-error");
    });
}

function onButtonSend() {
  var message = messageInput.value;
  if (message.trim().length <= 0) {
    return;
  }
  sendMessage(message);
}

function sendMessage(message) {
  var messageData = {
    "message": message,
    "user": firebase.auth().currentUser.email,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }

  database.collection("channels").doc(currentChannelId).collection("messages").add(messageData)
    .then((docRef) => {
      messageInput.value = "";
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

document.addEventListener("keypress", function (event) {
  var key = event.keyCode || event.which;
  if (event.keyCode == 13) {
    onButtonSend();
  }
});

messageInput.addEventListener("focus", function () {
  messagesHTML.scrollTop = messagesHTML.scrollHeight;
});

fileInput.addEventListener("change", (e) => doSomethingWithFiles(e.target.files));

function doSomethingWithFiles(files) {
  var fileToUpload = files[0];
  if (fileToUpload != null) {
    console.log(fileToUpload.name);

    // When the user clicked on open we are here.
    // we could show the image with the loading.
    var url = URL.createObjectURL(files[0]);
    //console.log(url);
    createImageMessage(url);

    var uploadTask = storage.child("images/" + fileToUpload.name).put(fileToUpload);
    uploadTask.on("state_changed", snapshot => {      
      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      var progressTextHTML = document.getElementById(url);
      progressTextHTML.innerHTML = "Uploaded " + percentage.toFixed(2) + "%";
    },
    error => {
      console.log(error.message);
    },
    () => {
      console.log("Upload is done!");
      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
        console.log("Uploaded at " + downloadURL);        
        sendMessage(downloadURL);        
      });
    });
  }
}

function createImageMessage(url) {
  var messageBubbleHTML = document.createElement("div");
  messageBubbleHTML.classList.add("chat-bubble");  

  var messageContainerHTML = document.createElement("div");
  messageContainerHTML.classList.add("message-container", "card", "bg-dark", "text-white");
  
  var imageHTML = document.createElement("img");
  imageHTML.src = url;
  imageHTML.classList.add("card-img");
  messageContainerHTML.appendChild(imageHTML);

  var imageOverlayHTML = document.createElement("div");
  imageOverlayHTML.classList.add("card-img-overlay");
  messageContainerHTML.appendChild(imageOverlayHTML);

  var loaderHTML = document.createElement("div");  
  loaderHTML.classList.add("loader");  
  imageOverlayHTML.appendChild(loaderHTML);

  var progressTextHTML = document.createElement("p");
  progressTextHTML.id = url;
  progressTextHTML.innerHTML = "Uploading 0%";
  imageOverlayHTML.appendChild(progressTextHTML);

  messageBubbleHTML.appendChild(messageContainerHTML);
  messagesHTML.appendChild(messageBubbleHTML);
}
