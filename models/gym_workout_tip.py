from odoo import models, fields



class GymWorkoutTip(models.Model):
    _name = 'gym.workout.tip'
    _description = 'Workout Tip'

    title = fields.Char(required=True)
    description = fields.Text()
    category = fields.Selection([
        ('general', 'General'),
        ('motivational', 'Motivational'),
        ('challenges', 'Challenges'),
        ('arms', 'Arms'),
        ('legs', 'Legs'),
        ('chest', 'Chest'),
        ('back', 'Back'),
        ('core', 'Core'),
    ], default='general', required=True)
    image = fields.Binary("Image")
    active = fields.Boolean(default=True)
