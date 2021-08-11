const firstNames = ["Justė","AKiss","Ąžuolas","Kamilė","Dalia","Saulius","Juratė","Lukas","Dovydas","Ignas","Inga", "Laura", "Kristina", "Valdelis", "Marius", "Tania", "Rūta", "Gintarė", "Tomas", "Erlandas", "Giedrius", "Viktorija", "Ramas", "Efka", "Reno", "Rex", "Mama", "Tete", "Sese", "Teta"];

const secondNames = ["Paprastutė","Generolas","Nuolanki","Trapi","Išmintinga","Kietasis","1","2","3","","Sasiska","Puikioji","Išmanusis","Piktas","Rusas","Kiškis","Genijus","Babulė","Dundukas","Siaubūnas", "Protinguolis", "Afigienas", "Beprotis", "Juokingas", "Tikintis", "Storulis", "Beprotis", "Pilotas", "Trumparegis", "Mamos", "Koldūnas", "Sliekas", "Baršiasriubis", "Gudrus", "Gerasis", "Išprotejusi", "Karšta", "Gudri", "Putiovas","Digimonas", "Pokemonas", "Gražioji"];

const getRandomNumber = (max) => Math.floor(Math.random() * max);

const getRandomName = () => 
  `${firstNames[getRandomNumber(firstNames.length)]} ${secondNames[getRandomNumber(secondNames.length)]}`;

const setRandomName = () => {
  document.getElementById('random-name').innerText = getRandomName();
}

document.getElementById('generate')
  .addEventListener('click', setRandomName);

setRandomName();

// 1 Dar bus galima irasyti vardo ir pavardes pasiulymus vartotojui turinciam lvl
// 1 Kad vartotojas galetu kazka pasiulyti arba Registruojantis
// 1 Jo nickas nueitu i pasiulymus const firstNames
// 2  Auto copy mygtukas arba tiesiog paspaudus ant patinkancio nick
// 2 nickas nusikeltu i registracija
// funkcija kolkas neveikia
function autoCopy() {
  var copyText = document.getElementById("myInput");
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}