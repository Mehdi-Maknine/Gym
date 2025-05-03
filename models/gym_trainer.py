from odoo import models, fields

class GymTrainer(models.Model):
    _name = 'gym.trainer'
    _description = 'Gym Trainer'

    name = fields.Char(required=True)
    specialty = fields.Char()
    phone = fields.Char()
    email = fields.Char()
    assigned_member_ids = fields.One2many('gym.member', 'trainer_id', string='Assigned Members')
