from odoo import models, fields, api


class GymTrainer(models.Model):
    _name = 'gym.trainer'
    _description = 'Gym Trainer'
    _order = 'member_count desc, name asc'

    name = fields.Char(required=True)
    specialty = fields.Char()
    phone = fields.Char()
    email = fields.Char()
    active = fields.Boolean(default=True)
    assigned_member_ids = fields.One2many('gym.member', 'trainer_id', string='Assigned Members')
    member_count = fields.Integer(string='Assigned Members Count', compute='_compute_member_count', store=True)
    partner_id = fields.Many2one('res.partner', string='Contact')




    @api.depends('assigned_member_ids')
    def _compute_member_count(self):
        for trainer in self:
            trainer.member_count = len(trainer.assigned_member_ids)
