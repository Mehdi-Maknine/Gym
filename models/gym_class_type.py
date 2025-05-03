from odoo import models, fields

class GymClassType(models.Model):
    _name = 'gym.class.type'
    _description = 'Gym Class Type'

    name = fields.Char(required=True)
    description = fields.Text()
