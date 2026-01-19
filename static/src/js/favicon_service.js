/** @odoo-module **/

import { registry } from "@web/core/registry";
import { user } from "@web/core/user";

/**
 * Favicon Service - Updates browser favicon based on current company's custom favicon
 * Compatible with Odoo 19.0
 */
const faviconService = {
    dependencies: [],
    
    start(env) {
        // Store reference to original Odoo favicon
        const originalFavicon = _getCurrentFavicon();
        
        // Update favicon initially after a short delay to ensure user data is loaded
        setTimeout(() => _updateFavicon(originalFavicon), 1000);
        
        // Listen for company changes using polling
        let lastCompanyId = _getCompanyId();
        
        setInterval(() => {
            const currentCompanyId = _getCompanyId();
            if (currentCompanyId && currentCompanyId !== lastCompanyId) {
                lastCompanyId = currentCompanyId;
                _updateFavicon(originalFavicon);
            }
        }, 1000);
        
        return {};
    },
};

function _getCompanyId() {
    // user.activeCompany returns an object with {id, name, ...} in Odoo 19
    const activeCompany = user.activeCompany;
    if (activeCompany && typeof activeCompany === 'object') {
        return activeCompany.id;
    }
    // Fallback for number
    return activeCompany;
}

function _getCurrentFavicon() {
    const link = document.querySelector("link[rel*='icon']");
    return link ? link.href : '/web/static/img/favicon.ico';
}

function _updateFavicon(originalFavicon) {
    const companyId = _getCompanyId();
    if (!companyId) return;
    
    // URL untuk favicon custom company
    const faviconUrl = `/web/company/${companyId}/favicon?t=${Date.now()}`;
    
    // Check apakah company punya custom favicon
    fetch(faviconUrl, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                // Company punya custom favicon, pakai itu
                _setFavicon(faviconUrl);
            } else {
                // Tidak ada custom favicon, pakai default Odoo
                _setFavicon(originalFavicon || '/web/static/img/favicon.ico');
            }
        })
        .catch(() => {
            // Error, pakai default
            _setFavicon(originalFavicon || '/web/static/img/favicon.ico');
        });
}

function _setFavicon(url) {
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

registry.category("services").add("favicon", faviconService);
