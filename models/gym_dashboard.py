from odoo import models, fields
from odoo.tools import date_utils
from datetime import date, timedelta

class GymDashboard(models.Model):
    _name = 'gym.dashboard'
    _description = 'Gym Dashboard'
    _auto = False

    name = fields.Char()
    active_members = fields.Integer()
    upcoming_sessions = fields.Integer()
    expiring_members = fields.Integer()
    total_payments = fields.Float()

    def init(self):
        # No table created
        pass

    @property
    def _table_query(self):
        # Dummy table query to satisfy Odoo ORM
        return "(SELECT 1 AS id, 'Dashboard' AS name, 0 AS active_members, 0 AS upcoming_sessions, 0 AS expiring_members, 0.0 AS total_payments) AS gym_dashboard"

    @classmethod
    def search(cls, args, offset=0, limit=None, order=None, count=False):
        # Only one dashboard record is needed
        dashboard = cls._get_dashboard_data()
        return cls.browse([dashboard.id]) if dashboard else cls

    @classmethod
    def _get_dashboard_data(cls):
        env = cls.env()
        today = date.today()
        in_7_days = today + timedelta(days=7)

        Member = env['gym.member'].sudo()
        Session = env['gym.session'].sudo()
        Payment = env['gym.payment'].sudo()

        active_members = Member.search_count([('active', '=', True)])
        upcoming_sessions = Session.search_count([
            ('start_datetime', '>=', fields.Datetime.now()),
            ('start_datetime', '<=', fields.Datetime.now() + timedelta(days=7))
        ])
        expiring_members = Member.search_count([
            ('membership_end_date', '>=', today),
            ('membership_end_date', '<=', in_7_days)
        ])
        total_payments = sum(Payment.search([]).mapped('amount'))

        # Create a transient record in memory
        return cls(env).new({
            'name': 'Gym Dashboard',
            'active_members': active_members,
            'upcoming_sessions': upcoming_sessions,
            'expiring_members': expiring_members,
            'total_payments': total_payments,
        })
