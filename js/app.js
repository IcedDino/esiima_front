import headerHtml from '/components/header.html?raw';
import navigationHtml from '/components/navigation.html?raw';
import footerHtml from '/components/footer.html?raw';

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("header-container").innerHTML = headerHtml;
    document.getElementById("navigation-container").innerHTML = navigationHtml;
    document.getElementById("footer-container").innerHTML = footerHtml;
});
