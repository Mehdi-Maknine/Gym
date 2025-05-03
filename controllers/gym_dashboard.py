from odoo import http
from odoo.http import request

class GymDashboardController(http.Controller):

    @http.route('/gym/dashboard', type='http', auth='user')
    def gym_dashboard(self, **kw):
        Member = request.env['gym.member'].sudo()
        Session = request.env['gym.session'].sudo()
        Payment = request.env['gym.payment'].sudo()

        active_members = Member.search_count([('active', '=', True)])
        upcoming_sessions = Session.search_count([
            ('start_datetime', '>=', fields.Datetime.now()),
            ('start_datetime', '<=', fields.Datetime.now() + timedelta(days=7))
        ])
        expiring_members = Member.search_count([
            ('membership_end_date', '>=', fields.Date.today()),
            ('membership_end_date', '<=', fields.Date.today() + timedelta(days=7))
        ])
        total_payments = sum(Payment.search([]).mapped('amount'))

        return request.render('gym_meliora.gym_dashboard_template', {
            'active_members': active_members,
            'upcoming_sessions': upcoming_sessions,
            'expiring_members': expiring_members,
            'total_payments': total_payments
        })
