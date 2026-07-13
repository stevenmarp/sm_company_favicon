(function () {
    'use strict';
    
    let originalFavicon = null;
    let lastCompanyId = null;
    
    function getCurrentFavicon() {
        const link = document.querySelector("link[rel*='icon']");
        return link ? link.href : '/web/static/img/favicon.ico';
    }
    
    function getCurrentCompanyId() {
        if (typeof odoo !== 'undefined' && odoo.session_info) {
            if (odoo.session_info.user_companies && odoo.session_info.user_companies.current_company) {
                return odoo.session_info.user_companies.current_company;
            }
            if (odoo.session_info.company_id) {
                return odoo.session_info.company_id;
            }
        }
        return null;
    }
    
    function setFavicon(url) {
        // Remove existing favicon links
        const existingLinks = document.querySelectorAll("link[rel*='icon']");
        existingLinks.forEach(link => link.remove());
        
        // Create new favicon link
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.type = 'image/x-icon';
        newLink.href = url;
        document.head.appendChild(newLink);
        
        // Also add shortcut icon for compatibility
        const shortcutLink = document.createElement('link');
        shortcutLink.rel = 'shortcut icon';
        shortcutLink.type = 'image/x-icon';
        shortcutLink.href = url;
        document.head.appendChild(shortcutLink);
    }
    
    function updateFavicon() {
        const companyId = getCurrentCompanyId();
        if (!companyId) return;
        
        // URL for custom company favicon
        const faviconUrl = `/web/company/${companyId}/favicon?t=${Date.now()}`;
        
        // Check if company has custom favicon
        fetch(faviconUrl, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    setFavicon(faviconUrl);
                } else {
                    setFavicon(originalFavicon || '/web/static/img/favicon.ico');
                }
            })
            .catch(() => {
                setFavicon(originalFavicon || '/web/static/img/favicon.ico');
            });
    }
    
    function init() {
        if (!originalFavicon) {
            originalFavicon = getCurrentFavicon();
        }
        
        const companyId = getCurrentCompanyId();
        lastCompanyId = companyId;
        
        updateFavicon();
    }
    
    // Polling loop
    setInterval(() => {
        const currentCompanyId = getCurrentCompanyId();
        if (currentCompanyId && currentCompanyId !== lastCompanyId) {
            lastCompanyId = currentCompanyId;
            updateFavicon();
        }
    }, 1000);
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    setTimeout(init, 500);
    setTimeout(init, 1000);
})();
