from odoo import models, fields, api
from odoo.exceptions import ValidationError

class GymClassAttendance(models.Model):
    _name = 'gym.class.attendance'
    _description = 'Gym Class Attendance'
    _order = 'session_id, check_in_time'

    session_id = fields.Many2one('gym.session', string='Session', required=True)
    member_id = fields.Many2one('gym.member', string='Member', required=True)
    check_in_time = fields.Datetime(string='Check-In Time', default=fields.Datetime.now)
    status = fields.Selection([
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
    ], default='present', string='Status')

    @api.constrains('member_id', 'session_id')
    def _check_duplicate_entry(self):
        for record in self:
            existing = self.search([
                ('member_id', '=', record.member_id.id),
                ('session_id', '=', record.session_id.id),
                ('id', '!=', record.id)
            ])
            if existing:
                raise ValidationError("This member already has an attendance record for this session.")
