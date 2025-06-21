from odoo import models, fields, api
from odoo.exceptions import ValidationError

class GymSession(models.Model):
    _name = 'gym.session'
    _description = 'Gym Class Session'

    name = fields.Char(required=True)
    trainer_id = fields.Many2one('gym.trainer', string='Trainer', required=True)
    start_datetime = fields.Datetime(required=True)
    end_datetime = fields.Datetime(required=True)
    max_members = fields.Integer(string='Maximum Members', default=10)
    enrolled_member_ids = fields.Many2many('gym.member', string='Enrolled Members')
    attendance_ids = fields.One2many('gym.class.attendance', 'session_id', string='Attendance Records')
    class_type_id = fields.Many2one('gym.class.type', string='Class Type')
    duration = fields.Float(string='Duration (hrs)', compute='_compute_duration', store=True)
    location = fields.Char(string='Location')

   
   
   
   
    @api.depends('start_datetime', 'end_datetime')
    def _compute_duration(self):
        for rec in self:
            if rec.start_datetime and rec.end_datetime:
                delta = rec.end_datetime - rec.start_datetime
                rec.duration = delta.total_seconds() / 3600.0
            else:
                rec.duration = 0.0

    
    @api.constrains('enrolled_member_ids', 'max_members')
    def _check_max_enrollment(self):
        for session in self:
            if session.max_members and len(session.enrolled_member_ids) > session.max_members:
                raise ValidationError("Cannot enroll more members than the maximum allowed.")


    def mark_all_present(self):
        for session in self:
            for member in session.enrolled_member_ids:
                already_marked = self.env['gym.class.attendance'].search_count([
                    ('session_id', '=', session.id),
                    ('member_id', '=', member.id)
                ])
                if already_marked:
                    continue  # skip if already marked

                self.env['gym.class.attendance'].create({
                    'session_id': session.id,
                    'member_id': member.id,
                    'status': 'present',
                    'check_in_time': fields.Datetime.now(),
                })

