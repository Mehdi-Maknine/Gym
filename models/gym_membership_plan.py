from odoo import models, fields

class GymMembershipPlan(models.Model):
    _name = 'gym.membership.plan'
    _description = 'Gym Membership Plan'

    name = fields.Char(required=True)
    price = fields.Float(string='Price')
    duration_months = fields.Integer(string='Duration (Months)')
    description = fields.Text()
