// Random nickname and password generator.
// Nicknames keep Lithuanian grammar: male names get male epithets, female names — female ones.
const NICKNAMES = {
  male: {
    names: [
      "Lukas", "Dovydas", "Ignas", "Marius", "Tomas", "Rokas", "Mantas", "Darius", "Paulius", "Mindaugas",
      "Gediminas", "Vytautas", "Kęstutis", "Andrius", "Justas", "Linas", "Tadas", "Žygimantas", "Laurynas", "Arūnas",
    ],
    epithets: [
      "Greitasis", "Išmintingasis", "Drąsusis", "Linksmasis", "Gudrusis", "Ramusis", "Kietasis", "Protingasis",
      "Smalsusis", "Nenugalimasis", "Žaibiškasis", "Didysis", "Mįslingasis", "Genialusis", "Budrusis",
    ],
  },
  female: {
    names: [
      "Justė", "Kamilė", "Dalia", "Inga", "Laura", "Kristina", "Rūta", "Gintarė", "Viktorija", "Aistė",
      "Eglė", "Monika", "Greta", "Jūratė", "Aušra", "Milda", "Neringa", "Simona", "Gabrielė", "Augustė",
    ],
    epithets: [
      "Greitoji", "Išmintingoji", "Drąsioji", "Linksmoji", "Gudrioji", "Ramioji", "Kietoji", "Protingoji",
      "Smalsioji", "Nenugalimoji", "Žaibiškoji", "Didžioji", "Mįslingoji", "Genialioji", "Budrioji",
    ],
  },
};

const PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?-_+=";

function randomIndex(max) {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] % max;
}

function pick(list) {
  return list[randomIndex(list.length)];
}

function generateNickname() {
  const group = Math.random() < 0.5 ? NICKNAMES.male : NICKNAMES.female;
  return `${pick(group.names)} ${pick(group.epithets)}`;
}

function generatePassword(length = 12) {
  let password = "";
  for (let i = 0; i < length; i++) password += PASSWORD_CHARS[randomIndex(PASSWORD_CHARS.length)];
  return password;
}
