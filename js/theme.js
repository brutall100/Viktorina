// Apply the saved theme before the page paints, so there is no flash.
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  try {
    var saved = localStorage.getItem("viktorina-theme");
    if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  } catch (e) {
    /* storage blocked — follow the system theme */
  }
})();
