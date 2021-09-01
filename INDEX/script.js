function start() {
  startTime();
  getRndInteger();

  window.onload = start;
}

//function openForm() {
 // document.getElementById("myForm").style.display = "block";
//}





























function naujasKlausimas() {
  location.href = 'newQ.html';
}

function indexPuslapis() {
  location.href = "index.html";
}

//laiko scriptas//
function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('laikas').innerHTML =
    h + ":" + m + ":" + s;
  var t = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) { i = "0" + i };
  return i;
}

