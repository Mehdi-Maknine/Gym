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
