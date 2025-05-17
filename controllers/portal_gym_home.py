from odoo import http
from odoo.http import request
from collections import defaultdict
from datetime import date, timedelta
import json
import base64


class GymPortal(http.Controller):

    
    @http.route(['/my/gym'], type='http', auth='user', website=True)
    def portal_my_gym(self, **kw):
        user = request.env.user
        member = request.env['gym.member'].sudo().search([('partner_id', '=', user.partner_id.id)], limit=1)
        return request.render("gym_meliora.portal_my_gym_homepage", {'member': member})

    
    @http.route(['/my/gym/sessions'], type='http', auth='user', website=True)
    def portal_gym_sessions(self, **kw):
        user = request.env.user
        member = request.env['gym.member'].sudo().search([('partner_id', '=', user.partner_id.id)], limit=1)

        sessions = []
        events = []

        if member:
            sessions = request.env['gym.session'].sudo().search([
                ('enrolled_member_ids', 'in', member.id)
            ], order='start_datetime asc')

            for session in sessions:
                events.append({
                    'title': f"{session.name} ({session.trainer_id.name})",
                    'start': session.start_datetime.isoformat(),
                    'end': session.end_datetime.isoformat(),
                })

        return request.render("gym_meliora.portal_my_gym_sessions", {
            'sessions': sessions,
            'member': member,
            'calendar_events': json.dumps(events),
        })

    
    
    @http.route(['/my/gym/attendance'], type='http', auth='user', website=True)
    def portal_gym_attendance(self, **kw):
        user = request.env.user
        partner = user.partner_id
        member = request.env['gym.member'].sudo().search([('partner_id', '=', partner.id)], limit=1)

        attendance_records = []
        if member:
            attendance_records = request.env['gym.class.attendance'].sudo().search([
                ('member_id', '=', member.id)
            ], order='check_in_time desc')

        return request.render("gym_meliora.portal_my_gym_attendance", {
            'attendance_records': attendance_records,
            'member': member
        })


    @http.route(['/my/gym/invoices'], type='http', auth='user', website=True)
    def portal_gym_invoices(self, **kw):
        user = request.env.user
        partner = user.partner_id
        member = request.env['gym.member'].sudo().search([('partner_id', '=', partner.id)], limit=1)

        payments = []
        if member:
            payments = request.env['gym.payment'].sudo().search([
                ('member_id', '=', member.id)
            ], order='payment_date desc')

        return request.render("gym_meliora.portal_my_gym_invoices", {
            'payments': payments,
            'member': member
        })
        
        
    @http.route(['/my/gym/dashboard'], type='http', auth='user', website=True)
    def portal_gym_dashboard(self, **kw):
        user = request.env.user
        partner = user.partner_id
        member = request.env['gym.member'].sudo().search([('partner_id', '=', partner.id)], limit=1)

        attendance_model = request.env['gym.class.attendance'].sudo()

        attendances = attendance_model.search([
            ('member_id', '=', member.id),
            ('status', '=', 'present')
        ], order='check_in_time desc')

        total_attended = len(attendances)
        last_session = attendances[0].session_id.start_datetime if attendances else None

        # 📊 Monthly Chart Data
        monthly_data = defaultdict(int)
        dates = set()

        for rec in attendances:
            session_date = rec.session_id.start_datetime.date()
            dates.add(session_date)
            label = session_date.strftime("%b %Y")
            monthly_data[label] += 1

        chart_labels = list(monthly_data.keys())
        chart_values = list(monthly_data.values())

        # 🔥 Streak Counter
        today = date.today()
        streak = 0
        check_day = today

        while check_day in dates:
            streak += 1
            check_day -= timedelta(days=1)

        # 🏆 Badges
        badges = []
        if total_attended >= 5:
            badges.append("🎯 5 Sessions")
        if total_attended >= 10:
            badges.append("🏅 10 Sessions")
        if streak >= 3:
            badges.append("🔥 3-Day Streak")
        if streak >= 7:
            badges.append("🏆 7-Day Streak")
            
        # ✨ Motivational Quote by Streak Level
        motivational_quote = ""
        if streak >= 7:
            motivational_quote = "🏆 You're on fire! Keep the 7-day streak alive!"
        elif streak >= 3:
            motivational_quote = "🔥 You're building a great habit — 3-day streak!"
        elif streak == 1:
            motivational_quote = "💪 Good job showing up today!"
        else:
            motivational_quote = "⏳ No current streak... tomorrow is your fresh start."


        return request.render("gym_meliora.portal_my_gym_dashboard", {
            'member': member,
            'total_attended': total_attended,
            'last_session': last_session,
            'streak': streak,
            'badges': badges,
            'motivational_quote': motivational_quote,
            'chart_labels': chart_labels,
            'chart_values': chart_values,
        })

    @http.route(['/my/gym/profile'], type='http', auth='user', website=True, methods=['GET', 'POST'], csrf=True)
    def portal_gym_profile(self, **post):
        user = request.env.user
        partner = user.partner_id
        member = request.env['gym.member'].sudo().search([('partner_id', '=', partner.id)], limit=1)

        if request.httprequest.method == 'POST' and member:
            values = {
                'name': post.get('name'),
                'email': post.get('email'),
                'phone': post.get('phone'),
            }

            # Handle avatar upload
            avatar_file = request.httprequest.files.get('avatar')
            if avatar_file:
                image_data = base64.b64encode(avatar_file.read())
                member.partner_id.write({'image_1920': image_data})

            member.write(values)
            return request.redirect('/my/gym/profile')

        return request.render("gym_meliora.portal_my_gym_profile", {
            'member': member,
        })
