from odoo import models, fields, api
from odoo.exceptions import UserError

class GymMembershipPlan(models.Model):
    _name = 'gym.membership.plan'
    _description = 'Gym Membership Plan'
    _order = 'price asc, duration_months asc'

    name = fields.Char(required=True)
    price = fields.Float(string='Price')
    duration_months = fields.Integer(string='Duration (Months)')
    description = fields.Text()
    active = fields.Boolean(default=True)
    duration_label = fields.Char(string="Duration Label", compute="_compute_duration_label", store=False)
    per_day_cost = fields.Float(string="Cost per Day", compute="_compute_per_day_cost")
    member_count = fields.Integer(string="Members Using This Plan", compute="_compute_member_count")

    
    
    
    
    def _compute_member_count(self):
        for plan in self:
            plan.member_count = self.env['gym.member'].search_count([('membership_plan_id', '=', plan.id)]) 
    
    def _compute_per_day_cost(self):
        for plan in self:
            total_days = plan.duration_months * 30 or 1
            plan.per_day_cost = plan.price / total_days if plan.price else 0.0

    def _compute_duration_label(self):
        for plan in self:
            plan.duration_label = f"{plan.duration_months} month(s)" if plan.duration_months else "1 Day"

    def unlink(self):
        for plan in self:
            if self.env['gym.member'].search_count([('membership_plan_id', '=', plan.id)]) > 0:
                raise UserError("You cannot delete a plan that is currently used by members.")
        return super().unlink()
