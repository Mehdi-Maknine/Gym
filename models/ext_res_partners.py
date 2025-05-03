from odoo import models, fields


class ExtResPartner(models.Model):
    _inherit = 'res.partner'

    gym_member_id = fields.One2many('gym.member', 'user_id', string='Gym Member')
