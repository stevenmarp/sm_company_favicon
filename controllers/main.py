# -*- coding: utf-8 -*-
import base64
from odoo import http
from odoo.http import request, Response


class FaviconController(http.Controller):

    @http.route('/web/company/<int:company_id>/favicon', type='http', auth='public', cors='*')
    def get_company_favicon(self, company_id, **kwargs):
        """Return the custom favicon for the specified company."""
        company = request.env['res.company'].sudo().browse(company_id)
        
        if company.exists() and company.favicon:
            # Decode the base64 favicon
            favicon_data = base64.b64decode(company.favicon)
            
            # Determine content type based on file signature
            content_type = 'image/x-icon'
            if favicon_data[:8] == b'\x89PNG\r\n\x1a\n':
                content_type = 'image/png'
            elif favicon_data[:4] == b'GIF8':
                content_type = 'image/gif'
            elif b'<svg' in favicon_data[:100] or b'<?xml' in favicon_data[:100]:
                content_type = 'image/svg+xml'
            
            return Response(
                favicon_data,
                content_type=content_type,
                headers={
                    'Cache-Control': 'public, max-age=3600',
                }
            )
        
        # Return 404 if no custom favicon found
        return request.not_found()

    @http.route('/web/favicon', type='http', auth='public', cors='*')
    def get_current_company_favicon(self, **kwargs):
        """Return the favicon for the current user's company."""
        company_id = request.env.company.id if request.env.company else None
        
        if company_id:
            return self.get_company_favicon(company_id, **kwargs)
        
        return request.not_found()
