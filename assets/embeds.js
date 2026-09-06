/* ============================================================
   Zwei-Klick-Lösung für externe Einbettungen
   seuring.de – Variante B

   Grundgedanke: Solange niemand klickt, geht KEINE Anfrage an
   YouTube oder Google. Kein iframe im HTML und – wichtig – auch
   kein Vorschaubild von ytimg.com. Diese Variante zeigt gar kein
   Vorschaubild, damit ist die Regel bauartbedingt eingehalten.

   Erst der Klick erzeugt den iframe, und zwar auf
   youtube-nocookie.com statt youtube.com.

   Es werden keine Cookies gesetzt und nichts gespeichert. Die
   Einwilligung gilt nur für diesen einen Klick auf dieser einen
   Seitenansicht. Das ist Absicht: Ein Einwilligungsspeicher wäre
   der erste Schritt zurück zum Cookie-Banner.
   ============================================================ */

(function () {
  "use strict";

  function activate(box) {
    var id = box.getAttribute("data-id");
    var actions = box.querySelector(".post-actions");
    if (!actions) return;

    if (!id || id.indexOf("HIER_") === 0) {
      actions.innerHTML =
        "<p class='hint'><strong>Noch nicht konfiguriert.</strong> " +
        "In diesem Beitrag fehlt die Video-ID (Attribut <code>data-id</code>).</p>";
      return;
    }

    var frame = document.createElement("div");
    frame.className = "embed-frame";

    var iframe = document.createElement("iframe");
    // youtube-nocookie.com = erweiterter Datenschutzmodus.
    // autoplay=1, weil soeben aktiv auf Abspielen geklickt wurde.
    iframe.src =
      "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(id) +
      "?autoplay=1&rel=0";
    iframe.title = box.getAttribute("data-title") || "Video";
    iframe.allow =
      "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");

    frame.appendChild(iframe);
    actions.replaceWith(frame);
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-consent]");
    if (!trigger) return;

    var box = trigger.closest(".post");
    if (!box) return;

    event.preventDefault();
    activate(box);
  });
})();
