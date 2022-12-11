let firstNames = ["Justė","AKiss","Ąžuolas","Kamilė","Dalia","Saulius","Juratė","Lukas","Dovydas","Ignas","Inga", "Laura", "Kristina", "Valdelis", "Marius", "Tania", "Rūta", "Gintarė", "Tomas", "Erlandas", "Giedrius", "Viktorija", "Ramas", "Efka", "Reno", "Rex", "Mama", "Tete", "Sese", "Teta"];

let secondNames = ["Uoga","Pupa","Super","Linksmuolis","Bambalinis","Kukli","Paprastutė","Generolas","Nuolanki","Trapi","Išmintinga","Kietasis","1","2","3","","Sasiska","Puikioji","Išmanusis","Piktas","Rusas","Kiškis","Genijus","Babulė","Dundukas","Siaubūnas", "Protinguolis", "Afigienas", "Beprotis", "Juokingas", "Tikintis", "Storulis", "Beprotis", "Pilotas", "Trumparegis", "Mamos", "Koldūnas", "Sliekas", "Baršiasriubis", "Gudrus", "Gerasis", "Išprotejusi", "Karšta", "Gudri", "Putiovas","Digimonas", "Pokemonas", "Gražioji"];

let getRandomNumber = (max) => Math.floor(Math.random() * max);

let getRandomName = () => 
  `${firstNames[getRandomNumber(firstNames.length)]} ${secondNames[getRandomNumber(secondNames.length)]}`;

let setRandomName = () => {
  document.getElementById('random-name').innerText = getRandomName();
}

document.getElementById('generuoti-varda')
  .addEventListener('click', setRandomName);

setRandomName();


const randomName = document.getElementById('random-name');
const clipboard = document.getElementById('clipboard');

clipboard.onclick = function() {
    randomName.select();
	document.execCommand('Copy');
  
}




function generatePassword() {
  var password = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};':" + "\\|,.<>/?`~";

  for (var i = 0; i < 10; i++) {
    password += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  document.getElementById("password").innerHTML = password;
}