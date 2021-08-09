const firstNames = ["Juratė","Lukas","Dovydas","Ignas","Inga", "Laura", "Kristina", "Valdelis", "Marius", "Tania", "Rūta", "Gintarė", "Tomas", "Erlandas", "Giedrius", "Viktorija", "Ramas", "Efka", "Reno", "Rex", "Mama", "Tete", "Sese", "Teta"];

const secondNames = ["1","2","3","","Sasiska","Puikioji","Išmanusis","Piktas","Rusas","Kiškis","Genijus","Babulė","Dundukas","Siaubūnas", "Protinguolis", "Afigienas", "Beprotis", "Juokingas", "Tikintis", "Storulis", "Beprotis", "Pilotas", "Trumparegis", "Mamos", "Koldūnas", "Sliekas", "Baršiasriubis", "Gudrus", "Gerasis", "Išprotejusi", "Karšta", "Gudri", "Putiovas","Digimonas", "Pokemonas", "Gražioji"];

const getRandomNumber = (max) => Math.floor(Math.random() * max);

const getRandomName = () => 
  `${firstNames[getRandomNumber(firstNames.length)]} ${secondNames[getRandomNumber(secondNames.length)]}`;

const setRandomName = () => {
  document.getElementById('random-name').innerText = getRandomName();
}

document.getElementById('generate')
  .addEventListener('click', setRandomName);

setRandomName();