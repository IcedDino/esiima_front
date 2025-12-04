import headerHtml from '/components/header.html?raw';
import studentNavigationHtml from '/components/navigation.html?raw';
import teacherNavigationHtml from '/components/navigation-teacher.html?raw';
import adminNavigationHtml from '/components/navigation-admin.html?raw';
import footerHtml from '/components/footer.html?raw';

document.addEventListener("DOMContentLoaded", function() {
    const headerContainer = document.getElementById("header-container");
    const navigationContainer = document.getElementById("navigation-container");
    const footerContainer = document.getElementById("footer-container");
    
    if (headerContainer) {
        headerContainer.innerHTML = headerHtml;
        const studentName = localStorage.getItem('studentName');
        if (studentName) {
            const headerUsername = document.getElementById('header-username');
            if (headerUsername) {
                headerUsername.textContent = studentName;
            }
        }
        const roleForTopnav = localStorage.getItem('userRole');
        if (roleForTopnav === 'Docente') {
            const cajasItem = document.querySelector('#topnav .nav-item[data-section="cajas"]');
            if (cajasItem) {
                cajasItem.remove();
            }
        }
        document.body.classList.add('has-header');
    }

    if (navigationContainer) {
        const userRole = localStorage.getItem('userRole'); // Assumes 'admin', 'Docente', or 'student'
        if (userRole === 'admin') {
            navigationContainer.innerHTML = adminNavigationHtml;
        } else if (userRole === 'Docente') {
            navigationContainer.innerHTML = teacherNavigationHtml;
        } else {
            navigationContainer.innerHTML = studentNavigationHtml;
        }
        document.body.classList.add('has-sidebar');
    }

    if (footerContainer) {
        footerContainer.innerHTML = footerHtml;
    }
    
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
                toggleBtn.addEventListener('click', () => {
                    sidebar.classList.remove('sidebar-closed');
                    document.body.classList.remove('sidebar-closed');
                });
                document.body.appendChild(toggleBtn);
            }
            
            if (sidebar.classList.contains('sidebar-closed')) {
                toggleBtn.style.display = 'block';
            } else {
                toggleBtn.style.display = 'none';
            }
        };
        
        const observer = new MutationObserver(createToggleButton);
        observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
        createToggleButton();
    }
});
