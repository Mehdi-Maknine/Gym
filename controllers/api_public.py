from odoo import http, fields
from odoo.http import request, Response
import json
from datetime import datetime


class GymPublicAPI(http.Controller):

    # --- PROGRAMS ---
    @http.route('/api/programs', type='http', auth='public', methods=['GET', 'OPTIONS'])
    def get_programs(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_preflight()

        records = request.env['gym.class.type'].sudo().search([])
        data = [{
            'id': rec.id,
            'name': rec.name,
            'description': rec.description,
        } for rec in records]

        return self._json_response({'programs': data})

    # --- TRAINERS ---
    @http.route('/api/trainers', type='http', auth='public', methods=['GET', 'OPTIONS'])
    def get_trainers(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_preflight()

        records = request.env['gym.trainer'].sudo().search([('active', '=', True)], order='member_count desc')
        data = [{
            'id': rec.id,
            'name': rec.name,
            'specialty': rec.specialty,
            'member_count': rec.member_count,
            'certifications': []  # placeholder for frontend
        } for rec in records]

        return self._json_response({'trainers': data})

    # --- TIPS ---
    @http.route('/api/tips', type='http', auth='public', methods=['GET', 'OPTIONS'])
    def get_tips(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_preflight()

        category = request.params.get('category')
        domain = [('active', '=', True)]
        if category:
            domain.append(('category', '=', category))

        records = request.env['gym.workout.tip'].sudo().search(domain)
        data = [{
            'title': rec.title,
            'description': rec.description,
            'category': rec.category,
            'image': rec.image.decode('utf-8') if rec.image else None  # base64
        } for rec in records]

        return self._json_response({'tips': data})

    # --- SESSIONS ---
    @http.route('/api/sessions/upcoming', type='http', auth='public', methods=['GET', 'OPTIONS'])
    def get_upcoming_sessions(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_preflight()

        now = fields.Datetime.now()
        records = request.env['gym.session'].sudo().search([
            ('start_datetime', '>=', now)
        ], order='start_datetime asc', limit=5)

        data = [{
            'id': rec.id,
            'name': rec.name,
            'trainer': rec.trainer_id.name,
            'location': rec.location,
            'class_type': rec.class_type_id.name,
            'start_datetime': rec.start_datetime.isoformat(),
            'end_datetime': rec.end_datetime.isoformat(),
            'duration': rec.duration,
        } for rec in records]

        return self._json_response({'sessions': data})


    @http.route('/api/memberships', type='http', auth='public', methods=['GET', 'OPTIONS'])
    def get_memberships(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return self._cors_preflight()

        # Normal GET request
        plans = request.env['gym.membership.plan'].sudo().search([], order='price asc')
        result = []
        for plan in plans:
            result.append({
                'id': plan.id,
                'name': plan.name,
                'price': plan.price,
                'duration_months': plan.duration_months,
                'description': plan.description,
                'per_day_cost': plan.per_day_cost,
                'duration_label': plan.duration_label,
                'member_count': plan.member_count,
            })

        return self._json_response({'memberships': result})
    
    
    
    # --- Shared Utilities ---
    def _json_response(self, data):
        headers = [
            ('Content-Type', 'application/json'),
            ('Access-Control-Allow-Origin', 'http://localhost:3000'),
            ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type'),
        ]
        return Response(json.dumps(data), headers=headers, status=200)

    def _cors_preflight(self):
        headers = [
            ('Access-Control-Allow-Origin', 'http://localhost:3000'),
            ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type'),
        ]
        return Response("", headers=headers, status=200)
