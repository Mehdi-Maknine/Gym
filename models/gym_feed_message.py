from odoo import models, fields

class GymFeedMessage(models.Model):
    _name = 'gym.feed.message'
    _description = 'Gym Feed Message'
    _order = 'date_posted desc'

    title = fields.Char(required=True)
    content = fields.Text(string="Message")
    date_posted = fields.Datetime(string="Date Posted", default=fields.Datetime.now)
    image = fields.Image(string="Optional Image")
    active = fields.Boolean(default=True)
