import headerHtml from '/components/header.html?raw';
import navigationHtml from '/components/navigation.html?raw';
import footerHtml from '/components/footer.html?raw';

document.addEventListener("DOMContentLoaded", function() {
    const headerContainer = document.getElementById("header-container");
    const navigationContainer = document.getElementById("navigation-container");
    const footerContainer = document.getElementById("footer-container");
    
    if (headerContainer) headerContainer.innerHTML = headerHtml;
    if (navigationContainer) {
        navigationContainer.innerHTML = navigationHtml;
        // Add class to body when sidebar is present
        document.body.classList.add('has-sidebar');
    }
    if (footerContainer) footerContainer.innerHTML = footerHtml;
    
    // Sidebar toggle functionality for mobile
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.getElementById('subnav');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-open');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                if (sidebar && sidebar.classList.contains('sidebar-open')) {
                    if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
                        sidebar.classList.remove('sidebar-open');
                    }
                }
            }
        });
    }
});
