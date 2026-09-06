/* ============================================================
   Zwei-Klick-Lösung für externe Einbettungen
   seuring.de

   Grundgedanke: Solange niemand klickt, geht KEINE Anfrage an
   YouTube oder Google. Kein iframe im HTML, und – wichtig –
   auch kein Vorschaubild von ytimg.com. Die Vorschaubilder
   liegen lokal im Ordner assets/beitraege/.

   Erst der Klick erzeugt den iframe, und zwar auf
   youtube-nocookie.com statt youtube.com.

   Es werden keine Cookies gesetzt und nichts gespeichert.
   Die Einwilligung gilt nur für diesen einen Klick auf dieser
   einen Seitenansicht. Das ist Absicht: Ein Einwilligungs-
   speicher wäre der erste Schritt zurück zum Cookie-Banner.
   ============================================================ */

(function () {
  "use strict";

  function activate(box) {
    var id = box.getAttribute("data-id");
    var thumb = box.querySelector(".embed-thumb");

    if (!thumb) return;

    if (!id || id.indexOf("HIER_") === 0) {
      var warn = document.createElement("div");
      warn.className = "embed-body";
      warn.innerHTML =
        "<p class='embed-desc'><strong>Noch nicht konfiguriert.</strong> " +
        "In dieser Karte fehlt die Video-ID. Siehe README.md im Ordner " +
        "<code>website/</code>.</p>";
      thumb.replaceWith(warn);
      return;
    }

    var frame = document.createElement("div");
    frame.className = "embed-frame";

    var iframe = document.createElement("iframe");
    // youtube-nocookie.com = erweiterter Datenschutzmodus.
    // autoplay=1, weil der Nutzer soeben aktiv auf Abspielen geklickt hat.
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
    thumb.replaceWith(frame);

    var actions = box.querySelector(".embed-actions");
    if (actions) actions.remove();
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-consent]");
    if (!trigger) return;

    var box = trigger.closest(".embed");
    if (!box) return;

    event.preventDefault();
    activate(box);
  });
})();
