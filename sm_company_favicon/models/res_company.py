# -*- coding: utf-8 -*-
from odoo import models, fields, api


class ResCompany(models.Model):
    _inherit = 'res.company'

    # Field untuk upload favicon custom dari user/client
    favicon = fields.Binary(
        string='Company Favicon',
        attachment=True,
        help='Upload a custom favicon for this company. '
             'Recommended size: 32x32 or 16x16 pixels. '
             'Supported formats: PNG, ICO, SVG, GIF. '
             'This favicon will appear in browser tabs when this company is active.'
    )
    
    # Field untuk nama file favicon (optional, untuk tracking)
    favicon_filename = fields.Char(
        string='Favicon Filename',
        help='Original filename of the uploaded favicon'
    )
