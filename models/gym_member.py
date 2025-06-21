from odoo import models, fields, api
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from datetime import date
from odoo.exceptions import ValidationError, UserError



class GymMember(models.Model):
    _name = 'gym.member'
    _description = 'Gym Member'
    _order = "name asc"




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
    membership_status_message = fields.Char(compute="_compute_status_message", string="Status Message", store=True)
    state = fields.Selection([
                ('draft', 'Draft'),
                ('active', 'Active'),
                ('expired', 'Expired'),
            ], default='draft', string='Status')
    total_payments_display = fields.Float(string="Total Payments", compute="_compute_total_payments", store=False)
    session_ids = fields.Many2many('gym.session', string="Sessions Attended", compute="_compute_sessions_attended", store=False)



    @api.depends('is_membership_expired')
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
            template.send_mail(member.id, force_send=True).sudo()
            
            
    @api.depends('payment_ids.amount')
    def _compute_total_payments(self):
        for rec in self:
            rec.total_payments_display = sum(rec.payment_ids.mapped('amount'))


    def _compute_sessions_attended(self):
        for rec in self:
            rec.session_ids = self.env['gym.session'].search([('enrolled_member_ids', 'in', rec.id)])


    @api.constrains('join_date')
    def _check_join_date(self):
        for rec in self:
            if rec.join_date and rec.join_date > date.today():
                raise ValidationError("Join date cannot be in the future.")

    @api.onchange('membership_plan_id')
    def _onchange_plan_warning(self):
        if not self.membership_plan_id:
            return {
                'warning': {
                    'title': "Missing Plan",
                    'message': "You have not assigned a membership plan.",
                }
            }



    def action_set_draft(self):
        for rec in self:
            rec.state = 'draft'

    def action_set_active(self):
        for rec in self:
            rec.state = 'active'

    def action_set_expired(self):
        for rec in self:
            rec.state = 'expired'


    def action_open_payments(self):
        return {
            'type': 'ir.actions.act_window',
            'name': 'Payments',
            'res_model': 'gym.payment',
            'view_mode': 'list,form',
            'domain': [('member_id', '=', self.id)],
            'target': 'current',
        }

    def action_open_sessions_attended(self):
        return {
            'type': 'ir.actions.act_window',
            'name': 'Sessions',
            'res_model': 'gym.session',
            'view_mode': 'list,form',
            'domain': [('enrolled_member_ids', 'in', self.id)],
            'target': 'current',
        }
