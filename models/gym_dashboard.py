from odoo import models, fields, api
from datetime import timedelta


class GymDashboard(models.TransientModel):
    _name = 'gym.dashboard'
    _description = 'Gym Dashboard'

    name = fields.Char(default="Gym Dashboard")
    active_members = fields.Integer()
    upcoming_sessions = fields.Integer()
    expiring_members = fields.Integer()
    total_payments = fields.Float()

    @api.model
    def default_get(self, fields_list):
        """Ensure a new record is created when the dashboard loads."""
        res = super().default_get(fields_list)

        today = fields.Date.context_today(self)
        in_7_days = today + timedelta(days=7)

        res.update({
            'active_members': self.env['gym.member'].search_count([('active', '=', True)]),
            'upcoming_sessions': self.env['gym.session'].search_count([
                ('start_datetime', '>=', fields.Datetime.now()),
                ('start_datetime', '<=', fields.Datetime.now() + timedelta(days=7))
            ]),
            'expiring_members': self.env['gym.member'].search_count([
                ('membership_end_date', '>=', today),
                ('membership_end_date', '<=', in_7_days)
            ]),
            'total_payments': sum(self.env['gym.payment'].search([]).mapped('amount')),
        })

        return res
