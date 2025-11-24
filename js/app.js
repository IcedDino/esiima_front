document.addEventListener("DOMContentLoaded", function() {
    const loadComponent = (id, url) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;
            })
            .catch(error => console.error(`Error loading component from ${url}:`, error));
    };

    loadComponent("header-container", "/components/header.html");
    loadComponent("navigation-container", "/components/navigation.html");
    loadComponent("footer-container", "/components/footer.html");
});
