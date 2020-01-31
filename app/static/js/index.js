$(document).ready(function() {

var config = {
    apiKey: "AIzaSyDz_Vdi8JM-m64xMqQQi8xo27yWE01YaAA",
    authDomain: "spellit-7ab05.firebaseapp.com",
    databaseURL: "https://spellit-7ab05.firebaseio.com",
    projectId: "spellit-7ab05",
    storageBucket: "spellit-7ab05.appspot.com",
    messagingSenderId: "972909964879",
    appId: "1:972909964879:web:4125ccf73f5b1081b7043a",
    measurementId: "G-P6VGBDP23J"
  };
firebase.initializeApp(config);

$(".register form").on("submit", function(event) {
     event.prevantDefault();

     var email = $(".register .email").val();
     var password = $(".register .password").val();

     firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(user) {
            console.log(user);
        })
        .catch(function(err) {
            console.log(err);
        });
    });

});