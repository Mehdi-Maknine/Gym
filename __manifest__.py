{
    'name': 'Meliora Gym',
    'version': '1.0',
    'summary': 'Gym Application',
    'sequence': -1,
    'author': 'CarendaA',
    'category': 'Services',
    'depends': ['base', 'mail', 'website' , 'portal'],
    'assets': {
    'web.assets_frontend': [
        'gym_meliora/static/src/js/portal_theme_toggle.js',
        'gym_meliora/static/src/css/portal_gym_styles.css',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        'https://cdn.jsdelivr.net/npm/chart.js',
        'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js',
        'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css',
        'gym_meliora/static/src/js/portal_calendar_init.js',
        'gym_meliora/static/src/js/portal_dashboard_chart.js',
    ],
    },
    'data': [
        'views/gym_menu_views.xml',
        'views/gym_member_views.xml',
        'security/ir.model.access.csv',
        'views/gym_membership_plan_views.xml',
        'views/gym_trainer_views.xml',
        'views/gym_session_views.xml',
        'views/gym_class_attendance_views.xml',
        'views/gym_payment_views.xml',
        'views/gym_class_type_views.xml',
    #    'views/gym_dashboard_views.xml',
        'views/gym_dashboard_kanban.xml',
      # 'views/gym_portal_templates.xml',
        'data/mail_template_data.xml',
        'data/ir_cron_data.xml',
        'views/portal_my_gym.xml',
        'views/portal_my_gym_dashboard.xml',
        'views/portal_my_gym_sessions.xml',
        'views/portal_my_gym_attendance.xml',
        'views/portal_my_gym_invoices.xml',
        'views/portal_my_gym_profile.xml',
    #    'views/assets.xml'

    ],
    'qweb': [
    ],
    


    'installable': True,
    'application': True,
}
