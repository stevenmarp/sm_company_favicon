# -*- coding: utf-8 -*-
{
    'name': "Company Favicon",
    'summary': """Custom favicon per company - Easy to change company favicon in browser tabs""",
    'description': """
Company Favicon for Odoo
========================

Allow users to easily set custom favicons for each company. Perfect for multi-company 
environments where each company needs its own branding in browser tabs.

🎯 COMPATIBILITY
================
✅ Odoo 18.0 (Community & Enterprise)
✅ Odoo 17.0 (Community & Enterprise)

⚠️ This module uses the OWL framework service registry which is available in Odoo 17+.
   Not compatible with Odoo 16 or earlier versions.

✨ FEATURES
===========
• 🎨 Custom favicon per company - Upload unique favicon for each company
• 🔄 Automatic favicon change - Favicon updates when switching companies
• 📱 Multiple format support - PNG, ICO, SVG, GIF
• ⚡ Instant preview - See your favicon immediately in company settings
• 🏢 Multi-company ready - Perfect for organizations with multiple companies
• 💾 Persistent storage - Favicon stored securely in database
• 🌐 Works everywhere - Backend interface supported

📋 HOW TO USE
=============
1. Go to Settings → Users & Companies → Companies
2. Select the company you want to customize
3. Scroll down to the "Favicon" section
4. Upload your favicon image (recommended: 32x32 or 16x16 PNG)
5. Save - The favicon updates automatically in your browser tab!

📁 SUPPORTED FORMATS
====================
• PNG (recommended) - Best quality, transparent background supported
• ICO - Traditional favicon format
• SVG - Vector graphics, scalable
• GIF - Animated favicons supported

💡 TIPS
=======
• For best results, use a square image (32x32 or 16x16 pixels)
• PNG format with transparent background works best
• Each company can have a different favicon
• If no favicon is uploaded, Odoo default favicon is used

🔧 TECHNICAL INFO
=================
• Extends res.company model with favicon binary field
• HTTP controller serves favicon at /web/company/<id>/favicon
• JavaScript service monitors company changes and updates browser favicon
• Automatic content-type detection for different image formats
• Browser cache optimization with cache headers

📞 SUPPORT
==========
For questions, issues, or feature requests, please contact the author
or leave a comment on the Odoo Apps page.
    """,
    'version': '19.0.1.0.0',
    'author': "Steven Marpaung",
    'maintainers': ['Stevenmarp'],
    'website': "https://apps.odoo.com/apps/browse?repo_maintainer_id=512936",
    'license': 'LGPL-3',
    'category': 'Extra Tools',
    'depends': ['web', 'base'],
    'data': [
        'views/res_company_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'sm_company_favicon/static/src/js/favicon_service.js',
        ],
    },
    'images': [
        'static/description/banner.png',
        'static/description/favicon_field.png',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
    'price': 2.00,
    'currency': 'USD',
}
