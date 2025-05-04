from odoo import models, fields, api
from datetime import timedelta
from datetime import date
from dateutil.relativedelta import relativedelta



class GymMember(models.Model):
    _name = 'gym.member'
    _description = 'Gym Member'

    name = fields.Char(required=True)
    email = fields.Char()
    phone = fields.Char()
    join_date = fields.Date(default=fields.Date.today)
    membership_plan_id = fields.Many2one('gym.membership.plan', string='Membership Plan')
    trainer_id = fields.Many2one('gym.trainer', string='Assigned Trainer')
    active = fields.Boolean(default=True)
    membership_end_date = fields.Date(string='Membership Ends', compute='_compute_membership_end_date', store=True)
    is_membership_expired = fields.Boolean(
        string='Membership Expired',
        compute='_compute_is_membership_expired',
        store=True
    )
    payment_ids = fields.One2many('gym.payment', 'member_id', string='Payments')
    
    
    partner_id = fields.Many2one('res.partner', string='Contact')
    user_id = fields.Many2one('res.users', compute='_compute_user_id', string='Portal User', store=False)
    membership_status_message = fields.Char(compute="_compute_status_message", string="Status Message")


    def _compute_status_message(self):
        for rec in self:
            rec.membership_status_message = (
                "⚠️ Membership has expired!" if rec.is_membership_expired else ""
            )






    
    
    @api.depends('membership_end_date')
    def _compute_is_membership_expired(self):
        today = date.today()
        for rec in self:
            rec.is_membership_expired = bool(rec.membership_end_date and rec.membership_end_date < today)

    
    
    
    @api.depends('partner_id')
    def _compute_user_id(self):
        for rec in self:
            rec.user_id = rec.partner_id.user_ids[:1] if rec.partner_id.user_ids else False
            
            
    @api.depends('join_date', 'membership_plan_id.duration_months')
    def _compute_membership_end_date(self):
        for rec in self:
            if rec.join_date and rec.membership_plan_id and rec.membership_plan_id.duration_months:
                rec.membership_end_date = rec.join_date + relativedelta(months=rec.membership_plan_id.duration_months)
            else:
                rec.membership_end_date = False


    def send_membership_expiry_reminders(self):
        days_before = 3  # number of days before expiry to send notification
        target_date = date.today() + timedelta(days=days_before)

        members = self.search([
            ('membership_end_date', '=', target_date),
            ('email', '!=', False),
            ('is_membership_expired', '=', False)
        ])

        template = self.env.ref('gym_meliora.email_template_membership_expiry')
        for member in members:
            template.send_mail(member.id, force_send=True)