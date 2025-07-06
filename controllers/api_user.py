# gym_meliora/controllers/member_dashboard.py

from odoo import http, fields
from odoo.http import request, Response
import json
from datetime import datetime, timedelta
import random


class GymUserApi(http.Controller):

    @http.route('/api/member/dashboard', type='http', auth='public', methods=['GET', 'OPTIONS'])
    def get_member_dashboard(self, **kwargs):
        # Handle preflight CORS request
        if request.httprequest.method == 'OPTIONS':
            return self._cors_preflight()

        # TEMP: use the first member (we’ll filter by logged-in user later)
        member = request.env['gym.member'].sudo().search([], limit=1)

        if not member:
            return self._json_response({'error': 'Member not found'})

        sessions = request.env['gym.session'].sudo().search([
            ('enrolled_member_ids', 'in', member.id),
            ('start_datetime', '>=', fields.Datetime.now())
        ], order='start_datetime asc')

        upcoming_sessions = [{
            'name': s.name,
            'start': s.start_datetime.isoformat(),
            'end': s.end_datetime.isoformat(),
            'trainer': s.trainer_id.name,
            'location': s.location,
        } for s in sessions]

        attendance = request.env['gym.class.attendance'].sudo().search([
            ('member_id', '=', member.id),
            ('status', '=', 'present')
        ])
        dates = sorted(set([a.check_in_time.date() for a in attendance]), reverse=True)
        streak = sum(1 for i, d in enumerate(dates) if d == datetime.now().date() - timedelta(days=i))

        tip = request.env['gym.workout.tip'].sudo().search([
            ('category', 'in', ['general', 'motivational']),
            ('active', '=', True)
        ], limit=1)

        feed = request.env['gym.feed.message'].sudo().search([
            ('active', '=', True)
        ], order='date_posted desc', limit=5)

        feed_data = [{
            'title': f.title,
            'content': f.content,
            'date': f.date_posted.strftime('%Y-%m-%d %H:%M')
        } for f in feed]

        return self._json_response({
            'name': member.name,
            'avatar': member.partner_id.image_128.decode() if member.partner_id.image_128 else None,
            'membership_expired': member.is_membership_expired,
            'membership_end_date': str(member.membership_end_date),
            'upcoming_sessions': upcoming_sessions,
            'progress_summary': {
                'total_checkins': len(attendance),
                'streak': streak,
                'completed_sessions': len(member.session_ids),
            },
            'daily_tip': {
                'title': tip.title,
                'description': tip.description
            } if tip else {},
            'feed': feed_data
        })
        
        
    @http.route('/api/sessions/search', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def search_sessions(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_preflight()

        domain = [('start_datetime', '>=', fields.Datetime.now())]

        if 'trainer_id' in kwargs:
            domain.append(('trainer_id', '=', int(kwargs['trainer_id'])))
        if 'class_type_id' in kwargs:
            domain.append(('class_type_id', '=', int(kwargs['class_type_id'])))
        if 'location' in kwargs:
            domain.append(('location', 'ilike', kwargs['location']))
        if 'start_date' in kwargs:
            domain.append(('start_datetime', '>=', kwargs['start_date']))
        if 'end_date' in kwargs:
            domain.append(('start_datetime', '<=', kwargs['end_date']))

        sessions = request.env['gym.session'].sudo().search(domain, order='start_datetime asc', limit=30)

        member = None
        if request.session.uid:
            user = request.env['res.users'].browse(request.session.uid)
            member = request.env['gym.member'].sudo().search([('partner_id', '=', user.partner_id.id)], limit=1)

        data = []
        for s in sessions:
            already_booked = member and member.id in s.enrolled_member_ids.ids
            data.append({
                'id': s.id,
                'name': s.name,
                'start_datetime': s.start_datetime.isoformat(),
                'end_datetime': s.end_datetime.isoformat(),
                'trainer': s.trainer_id.name,
                'class_type': s.class_type_id.name if s.class_type_id else None,
                'location': s.location,
                'spots_left': s.max_members - len(s.enrolled_member_ids),
                'is_booked': already_booked
            })

        return self._json_response({'sessions': data})

    def _json_response(self, data):
        headers = [
            ('Content-Type', 'application/json'),
            ('Access-Control-Allow-Origin', 'http://localhost:3000'),
            ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
            ('Access-Control-Allow-Credentials', 'true'),
            ('Access-Control-Allow-Headers', 'Content-Type'),
        ]
        return Response(json.dumps(data), headers=headers, status=200)

    def _cors_preflight(self):
        headers = [
            ('Access-Control-Allow-Origin', 'http://localhost:3000'),
            ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
            ('Access-Control-Allow-Credentials', 'true'),
            ('Access-Control-Allow-Headers', 'Content-Type'),
        ]
        return Response("", headers=headers, status=200)


    @http.route('/api/member/me', type='http', auth='user', methods=['GET', 'OPTIONS'])
    def get_member_profile(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_preflight()

        user = request.env.user
        partner = user.partner_id

        member = request.env['gym.member'].sudo().search([('partner_id', '=', partner.id)], limit=1)
        if not member:
            return self._json_response({'error': 'Member not found'})

        return self._json_response({
            "id": member.id,
            "name": member.name,
            "email": member.email,
            "phone": member.phone,
            "join_date": str(member.join_date),
            "membership": {
                "name": member.membership_plan_id.name,
                "end_date": str(member.membership_end_date),
                "expired": member.is_membership_expired,
                "status": member.state,
                "status_message": member.membership_status_message,
            },
            "trainer": {
                "name": member.trainer_id.name if member.trainer_id else None,
                "specialty": member.trainer_id.specialty if member.trainer_id else None
            },
            "total_payments": member.total_payments_display,
        })



    @http.route('/api/member/attendance', type='http', auth='user', methods=['GET', 'OPTIONS'])
    def get_member_attendance(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_preflight()

        user = request.env.user
        partner = user.partner_id
        member = request.env['gym.member'].sudo().search([('partner_id', '=', partner.id)], limit=1)

        if not member:
            return self._json_response({'error': 'Member not found'})

        attendance_records = request.env['gym.class.attendance'].sudo().search([
            ('member_id', '=', member.id)
        ], order='check_in_time desc')

        data = []
        for record in attendance_records:
            session = record.session_id
            data.append({
                "session": session.name,
                "date": session.start_datetime.strftime('%Y-%m-%d %H:%M') if session.start_datetime else "",
                "status": record.status,
                "trainer": session.trainer_id.name if session.trainer_id else None,
                "location": session.location,
            })

        return self._json_response(data)


    @http.route('/api/member/progress', type='http', auth='user', methods=['GET', 'OPTIONS'])
    def get_member_progress(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_preflight()

        user = request.env.user
        partner = user.partner_id
        member = request.env['gym.member'].sudo().search([('partner_id', '=', partner.id)], limit=1)

        if not member:
            return self._json_response({'error': 'Member not found'})

        today = fields.Date.today()
        attendance_model = request.env['gym.class.attendance'].sudo()

        # Get last 7 days check-ins
        weekly_data = []
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            count = attendance_model.search_count([
                ('member_id', '=', member.id),
                ('status', '=', 'present'),
                ('check_in_time', '>=', datetime.combine(day, datetime.min.time())),
                ('check_in_time', '<=', datetime.combine(day, datetime.max.time()))
            ])
            weekly_data.append(count)

        # Compute streak (from today backwards)
        dates = sorted(set([
            a.check_in_time.date()
            for a in attendance_model.search([
                ('member_id', '=', member.id),
                ('status', '=', 'present')
            ])
        ]), reverse=True)

        streak = 0
        for i in range(0, 30):  # max 30-day streak window
            check_date = today - timedelta(days=i)
            if check_date in dates:
                streak += 1
            else:
                break

        return self._json_response({
            "weekly_checkins": weekly_data,
            "streak_days": streak,
            "completed_sessions": len(member.session_ids),
            "badges": ["5 Check-ins", "Streak Master"] if streak >= 3 else []
        })



    @http.route('/api/feed/messages', type='http', auth='public', methods=['GET', 'OPTIONS'])
    def get_feed_messages(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_preflight()

        records = request.env['gym.feed.message'].sudo().search([
            ('active', '=', True)
        ], order='date_posted desc', limit=10)

        data = []
        for rec in records:
            data.append({
                "title": rec.title,
                "content": rec.content,
                "date": rec.date_posted.strftime('%Y-%m-%d %H:%M') if rec.date_posted else "",
                "image": rec.image.decode() if rec.image else None
            })

        return self._json_response(data)


    @http.route('/api/sessions/book', type='json', auth='user', methods=['POST'])
    def book_session(self, **kwargs):
        session_id = kwargs.get('session_id')
        if not session_id:
            return {"error": "Missing session_id"}

        user = request.env.user
        member = request.env['gym.member'].sudo().search([('partner_id', '=', user.partner_id.id)], limit=1)
        if not member:
            return {"error": "Member not found"}

        session = request.env['gym.session'].sudo().browse(int(session_id))
        if not session.exists():
            return {"error": "Session not found"}

        if member in session.enrolled_member_ids:
            return {"error": "Already enrolled"}

        if len(session.enrolled_member_ids) >= session.max_members:
            return {"error": "Session is full"}

        session.enrolled_member_ids = [(4, member.id)]
        return {"success": True, "message": "Enrolled successfully"}

    @http.route('/api/sessions/cancel', type='json', auth='user', methods=['POST'])
    def cancel_session(self, **kwargs):
        session_id = kwargs.get('session_id')
        if not session_id:
            return {"error": "Missing session_id"}

        user = request.env.user
        member = request.env['gym.member'].sudo().search([('partner_id', '=', user.partner_id.id)], limit=1)
        if not member:
            return {"error": "Member not found"}

        session = request.env['gym.session'].sudo().browse(int(session_id))
        if not session.exists():
            return {"error": "Session not found"}

        if member not in session.enrolled_member_ids:
            return {"error": "You are not enrolled in this session"}

        session.enrolled_member_ids = [(3, member.id)]
        return {"success": True, "message": "Enrollment canceled"}


    @http.route('/api/membership/renew', type='json', auth='user', methods=['POST'])
    def renew_membership(self, **kwargs):
        plan_id = kwargs.get('plan_id')
        if not plan_id:
            return {"error": "Missing plan_id"}

        user = request.env.user
        partner = user.partner_id
        member = request.env['gym.member'].sudo().search([('partner_id', '=', partner.id)], limit=1)

        if not member:
            return {"error": "Member not found"}

        plan = request.env['gym.membership.plan'].sudo().browse(int(plan_id))
        if not plan.exists():
            return {"error": "Plan not found"}

        # Update the membership
        member.write({
            'membership_plan_id': plan.id,
            'join_date': fields.Date.today(),
            'state': 'active',
            'is_membership_expired': False,
        })

        return {
            "success": True,
            "message": f"Membership renewed with plan '{plan.name}'",
            "membership_end_date": str(member.membership_end_date),
            "membership_name": plan.name
        }


    @http.route('/api/member/calendar', type='http', auth='user', methods=['GET', 'OPTIONS'])
    def get_member_calendar(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_preflight()

        user = request.env.user
        partner = user.partner_id
        member = request.env['gym.member'].sudo().search([('partner_id', '=', partner.id)], limit=1)

        if not member:
            return self._json_response({'error': 'Member not found'})

        now = fields.Datetime.now()

        all_sessions = request.env['gym.session'].sudo().search([
            ('enrolled_member_ids', 'in', member.id)
        ])

        attended_ids = request.env['gym.class.attendance'].sudo().search([
            ('member_id', '=', member.id),
            ('status', '=', 'present')
        ]).mapped('session_id').ids

        data = []
        for session in all_sessions:
            if session.id in attended_ids:
                status = 'attended'
            elif session.end_datetime and session.end_datetime < now:
                status = 'missed'
            else:
                status = 'upcoming'

            data.append({
                'id': session.id,
                'name': session.name,
                'start': session.start_datetime.isoformat(),
                'end': session.end_datetime.isoformat(),
                'trainer': session.trainer_id.name,
                'location': session.location,
                'status': status
            })

        return self._json_response({'calendar': data})


    @http.route('/api/member/update-profile', type='json', auth='user', csrf=False)
    def update_member_profile(self, **kwargs):
        user = request.env.user
        partner = user.partner_id
        member = request.env['gym.member'].sudo().search([('partner_id', '=', partner.id)], limit=1)

        if not member:
            return {'error': 'Member not found'}

        email = kwargs.get('email')
        phone = kwargs.get('phone')
        avatar = kwargs.get('avatar')  # base64 string

        if email:
            member.email = email
            member.partner_id.email = email
        if phone:
            member.phone = phone
            member.partner_id.phone = phone
        if avatar:
            member.partner_id.image_128 = avatar

        return {'success': True, 'message': 'Profile updated'}


    @http.route('/api/member/payments', type='http', auth='user', methods=['GET', 'OPTIONS'], csrf=False)
    def get_member_payments(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_preflight()

        user = request.env.user
        partner = user.partner_id
        member = request.env['gym.member'].sudo().search([('partner_id', '=', partner.id)], limit=1)

        if not member:
            return self._json_response({'error': 'Member not found'}, status=404)

        payments = request.env['gym.payment'].sudo().search([('member_id', '=', member.id)], order='payment_date desc')

        data = [{
            'id': p.id,
            'amount': p.amount,
            'payment_date': p.payment_date.strftime('%Y-%m-%d'),
            'plan': p.membership_plan_id.name if p.membership_plan_id else None,
            'note': p.note or ''
        } for p in payments]

        return self._json_response({'payments': data})
