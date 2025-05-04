from odoo import models, fields, api


class ExtResPartner(models.Model):
    _inherit = 'res.partner'

    gym_member_id = fields.One2many('gym.member', 'user_id', string='Gym Member')
    gym_member_main_id = fields.Many2one(
    'gym.member',
    compute='_compute_gym_member_main',
    string="Gym Member (Primary)"
    )

    @api.depends('gym_member_id')
    def _compute_gym_member_main(self):
        for partner in self:
            partner.gym_member_main_id = partner.gym_member_id[:1] if partner.gym_member_id else False

