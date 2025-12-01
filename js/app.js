import headerHtml from '/components/header.html?raw';
import navigationHtml from '/components/navigation.html?raw';
import footerHtml from '/components/footer.html?raw';

document.addEventListener("DOMContentLoaded", function() {
    const headerContainer = document.getElementById("header-container");
    const navigationContainer = document.getElementById("navigation-container");
    const footerContainer = document.getElementById("footer-container");
    
    if (headerContainer) {
        headerContainer.innerHTML = headerHtml;
        // Add class to body when header is present
        document.body.classList.add('has-header');

        // Highlight active top navigation item based on current page
        const currentPath = window.location.pathname;
        let activePage = 'control-escolar';

        if (currentPath.includes('cajas')) {
            activePage = 'cajas';
        } else if (currentPath.includes('situacion-actual')) {
            activePage = 'control-escolar';
        }

        const navItems = document.querySelectorAll('#topnav .nav-item');
        navItems.forEach(item => item.classList.remove('selected'));

        const activeLink = document.querySelector(`#topnav a[data-page="${activePage}"]`);
        if (activeLink && activeLink.parentElement.classList.contains('nav-item')) {
            activeLink.parentElement.classList.add('selected');
        }

        // Set header username from localStorage if available
        const headerUsername = document.getElementById('header-username');
        if (headerUsername) {
            const storedName = localStorage.getItem('studentName');
            if (storedName && storedName.trim().length > 0) {
                headerUsername.textContent = storedName;
            }
        }
    }
    if (navigationContainer) {
        navigationContainer.innerHTML = navigationHtml;
        // Add class to body when sidebar is present
        document.body.classList.add('has-sidebar');
    }
    if (footerContainer) footerContainer.innerHTML = footerHtml;
    
    // Sidebar close functionality
    const sidebarClose = document.querySelector('.sidebar-close');
    const sidebar = document.getElementById('subnav');
    
    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-closed');
            document.body.classList.toggle('sidebar-closed');
        });
    }
    
    // Add toggle button in header for mobile (when sidebar is closed)
    if (sidebar) {
        // Create a toggle button that appears when sidebar is closed
        const createToggleButton = () => {
            let toggleBtn = document.querySelector('.sidebar-open-btn');
            if (!toggleBtn) {
                toggleBtn = document.createElement('button');
                toggleBtn.className = 'sidebar-open-btn';
                toggleBtn.innerHTML = '☰';
                toggleBtn.setAttribute('aria-label', 'Open sidebar');
                toggleBtn.style.cssText = `
                    position: fixed;
                    top: 15px;
                    left: 15px;
                    z-index: 1001;
                    background: linear-gradient(135deg, #004080 0%, #003366 100%);
                    color: white;
                    border: 2px solid #ffd700;
                    border-radius: 8px;
                    padding: 10px 15px;
                    font-size: 1.5em;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    display: none;
                    transition: all 0.3s ease;
                `;
                toggleBtn.addEventListener('mouseenter', () => {
                    toggleBtn.style.transform = 'scale(1.1)';
                    toggleBtn.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
                });
                toggleBtn.addEventListener('mouseleave', () => {
                    toggleBtn.style.transform = 'scale(1)';
                    toggleBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                });
                toggleBtn.addEventListener('click', () => {
                    sidebar.classList.remove('sidebar-closed');
                    document.body.classList.remove('sidebar-closed');
                });
                document.body.appendChild(toggleBtn);
            }
            
            // Show/hide toggle button based on sidebar state
            if (sidebar.classList.contains('sidebar-closed')) {
                toggleBtn.style.display = 'block';
            } else {
                toggleBtn.style.display = 'none';
            }
        };
        
        // Check sidebar state on load and when it changes
        const observer = new MutationObserver(() => {
            createToggleButton();
        });
        observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
        createToggleButton();
    }
});
