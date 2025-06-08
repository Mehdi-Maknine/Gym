/** @odoo-module **/

import { Component, xml } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { BaseLayout } from "./gym_base_layout.js";

// 🔹 Subcomponent
class MotivationalBanner extends Component {
    static template = xml/* xml */ `
        <div class="hero-banner mb-5">
            <h1 class="display-4 fw-bold"><t t-esc="props.greeting"/></h1>
            <p class="lead mt-3"><t t-esc="props.motivation"/></p>
        </div>
        `;

}

class QuickActions extends Component {
  static template = xml/* xml */ `
    <div class="row text-center g-4 my-4">
      <t t-foreach="actions" t-as="btn" t-key="btn.href">
        <div class="col-6 col-md-3">
          <a t-att-href="btn.href" class="btn btn-outline-light py-3 w-100 rounded-pill shadow-sm">
            <i t-att-class="btn.icon + ' fa-2x mb-2 d-block'"></i>
            <span t-esc="btn.label"/>
          </a>
        </div>
      </t>
    </div>
  `;

  setup() {
    this.actions = [
      { href: '/my/gym/sessions', icon: 'fa fa-calendar-check', label: 'Sessions' },
      { href: '/my/gym/attendance', icon: 'fa fa-clock', label: 'Attendance' },
      { href: '/my/gym/invoices', icon: 'fa fa-file-invoice-dollar', label: 'Payments' },
      { href: '/my/gym/dashboard', icon: 'fa fa-chart-line', label: 'Dashboard' },
    ];
  }
}

class MembershipInfoCard extends Component {
    static template = xml/* xml */ `
      <div class="glass-card shadow-sm p-4 mt-4">
        <h5 class="fw-bold text-purple mb-3">
          <i class="fa fa-id-card me-2"/> Membership Overview
        </h5>
        <div class="row text-center">
          <div class="col-md-4">
            <strong>🏷️ Plan:</strong><br/>
            <t t-esc="props.plan"/>
          </div>
          <div class="col-md-4">
            <strong>📅 Joined on:</strong><br/>
            <t t-esc="props.join_date"/>
          </div>
          <div class="col-md-4">
            <strong>⏳ Valid Until:</strong><br/>
            <t t-esc="props.valid_until"/>
          </div>
        </div>
      </div>
    `;
}

class WorkoutTipsCarousel extends Component {
    static template = xml/* xml */ `
      <div class="my-5">
        <h4 class="text-white mb-3">🏋️ Workout Tips</h4>
        <div class="carousel-scroll d-flex gap-4 overflow-auto pb-2">
          <t t-foreach="tips" t-as="tip" t-key="tip.id">
            <div class="tip-card text-white shadow-sm p-3 rounded" style="min-width: 250px;">
              <img t-att-src="tip.image" class="rounded mb-2" style="width: 100%; height: 140px; object-fit: cover;"/>
              <h6 class="fw-bold mb-1"><t t-esc="tip.title"/></h6>
              <p class="small text-muted"><t t-esc="tip.description"/></p>
            </div>
          </t>
        </div>
      </div>
    `;

    setup() {
        console.log("📦 Tips from props:", this.props);
        this.tips = this.props.tips || [];
        }

}

class DailyChallengeCard extends Component {
    static template = xml/* xml */ `
      <div class="challenge-card bg-warning text-dark p-4 rounded shadow mt-4">
        <h5 class="fw-bold">🏆 Today's Challenge</h5>
        <img t-att-src="props.image" class="rounded mb-2" style="width: 100%; height: 150px; object-fit: cover;"/>
        <h6><t t-esc="props.title"/></h6>
        <p><t t-esc="props.description"/></p>
      </div>
    `;
}


class UpcomingSessionsPreview extends Component {
    static template = xml/* xml */ `
      <div class="my-5">
        <h4 class="mb-3 text-white">📅 Upcoming Sessions</h4>
        <div class="card p-3 bg-dark text-light shadow-sm">
          <t t-if="props.sessions">
            <ul class="list-group list-group-flush">
              <t t-foreach="props.sessions" t-as="s" t-key="s.name">
                <li class="list-group-item bg-transparent border-0 px-0 text-light">
                  <strong><t t-esc="s.name"/></strong> with <t t-esc="s.trainer"/> <br/>
                  <small>📍 <t t-esc="s.location"/> — <t t-esc="s.start"/></small>
                </li>
              </t>
            </ul>
          </t>
          <t t-if="!props.sessions">
            <div>No sessions booked yet.</div>
          </t>
        </div>
      </div>
    `;
}



// 🔹 Main component
class GymPortalHome extends Component {
    static components = {
            MotivationalBanner,
            QuickActions,
            MembershipInfoCard,
            WorkoutTipsCarousel,
            DailyChallengeCard,
            UpcomingSessionsPreview,
            BaseLayout,
            };

    static template = xml/* xml */`
        <BaseLayout>
            <MotivationalBanner greeting="props.greeting" motivation="props.motivation"/>
            <QuickActions/>
            <MembershipInfoCard
                plan="props.plan"
                join_date="props.join_date"
                valid_until="props.valid_until"
            />
            <WorkoutTipsCarousel tips="props.tips"/>
            <DailyChallengeCard challenge="props.challenge"/>
            <UpcomingSessionsPreview sessions="props.sessions"/>
        </BaseLayout>
    `;

}

// 🔹 Register
registry.category("public_components").add("gym_meliora.GymPortalHome", GymPortalHome);
