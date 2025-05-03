from odoo import models, fields

class GymPayment(models.Model):
    _name = 'gym.payment'
    _description = 'Gym Payment Record'

    member_id = fields.Many2one('gym.member', string='Member', required=True)
    plan_id = fields.Many2one('gym.membership.plan', string='Membership Plan')
    amount = fields.Float(required=True)
    payment_date = fields.Date(default=fields.Date.today, required=True)
    payment_method = fields.Selection([
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('bank', 'Bank Transfer'),
    ], string='Payment Method')
    note = fields.Text()
