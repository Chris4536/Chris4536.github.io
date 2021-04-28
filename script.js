// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhzDUw_ukDp17V2aXXpH_Wu54Xzxr68CE",
  authDomain: "chatapper-32e7c.firebaseapp.com",
  projectId: "chatapper-32e7c",
  storageBucket: "chatapper-32e7c.appspot.com",
  messagingSenderId: "500187557839",
  appId: "1:500187557839:web:c94de8f9bfe1ff54032cba",
  measurementId: "G-QME7PVT2KG"
};

function loadChannels() {
  database.collection("channels").orderBy("name")
}


function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}
