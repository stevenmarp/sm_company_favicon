/** @odoo-module **/

import { registry } from "@web/core/registry";
import { session } from "@web/session";

/**
 * Favicon Service - Updates browser favicon based on current company's custom favicon
 */
const faviconService = {
    dependencies: ["company"],
    
    start(env, { company }) {
        // Store reference to original Odoo favicon
        this.originalFavicon = this._getCurrentFavicon();
        
        // Update favicon initially
        this._updateFavicon();
        
        // Listen for company changes using polling
        let lastCompanyId = session.user_companies?.current_company;
        
        setInterval(() => {
            const currentCompanyId = this._getCurrentCompanyId();
            if (currentCompanyId && currentCompanyId !== lastCompanyId) {
                lastCompanyId = currentCompanyId;
                this._updateFavicon();
            }
        }, 1000);
        
        return {};
    },
    
    _getCurrentCompanyId() {
        if (session.user_companies?.current_company) {
            return session.user_companies.current_company;
        }
        return null;
    },
    
    _getCurrentFavicon() {
        const link = document.querySelector("link[rel*='icon']");
        return link ? link.href : '/web/static/img/favicon.ico';
    },
    
    _updateFavicon() {
        const companyId = this._getCurrentCompanyId();
        if (!companyId) return;
        
        // URL untuk favicon custom company
        const faviconUrl = `/web/company/${companyId}/favicon?t=${Date.now()}`;
        
        // Check apakah company punya custom favicon
        fetch(faviconUrl, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // Company punya custom favicon, pakai itu
                    this._setFavicon(faviconUrl);
                } else {
                    // Tidak ada custom favicon, pakai default Odoo
                    this._setFavicon(this.originalFavicon || '/web/static/img/favicon.ico');
                }
            })
            .catch(() => {
                // Error, pakai default
                this._setFavicon(this.originalFavicon || '/web/static/img/favicon.ico');
            });
    },
    
    _setFavicon(url) {
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
};

registry.category("services").add("favicon", faviconService);
