const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
let container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});




// function login() { 
//     document.getElementById("register").style.left = "20px"; 
//     document.getElementById("login").style.left = "400px";
//   }
//   function register() {
//     document.getElementById("login").style.left = "-40px";
//     document.getElementById("register").style.left = "40px";
//   }  

//   var f = document.getElementById("login-btn"); 
//   var g = document.getElementById("register-btn"); 
//   var h = document.getElementById("login"); 
//   var i = document.getElementById("register"); 
//   var j = document.getElementByClass("form-box"); 
// function login(){  
//     f.style.left = "-380px"; 
//     g.style.left = "170px"; 
//     h.style.left = "10px"; 
//     i.style.left = "10px"; 
//     j.style.left = "10px"; 
//   } 

//  var a = document.getElementById("login-btn"); 
//  var b = document.getElementById("register-btn"); 
//  var c = document.getElementById("login"); 
//  var d = document.getElementById("register");
//  var e = document.getElementByClass("form-box");
//  function register(){ 
//   a.style.left = "-1000px"; 
//   b.style.left = "-50px"; 
//   c.style.left = "100px"; 
//   d.style.left = "100px"; 
//   e.style.left = "100px"; 
//  } 
