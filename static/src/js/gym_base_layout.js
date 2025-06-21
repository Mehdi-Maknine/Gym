/** @odoo-module */

import { Component, useState, xml } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class BaseLayout extends Component {
 static template = xml/* xml */ `
  <div class="base-layout min-vh-100 d-flex flex-column bg-base text-light">
    <header class="base-header glass-header py-3 shadow-sm">
      <div class="container d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <img src="/gym_meliora/static/src/img/gym_logo.svg" alt="Logo" height="36" class="rounded shadow-sm"/>
          <h2 class="mb-0 fw-bold">Meliora Gym</h2>
        </div>
        <t t-slot="header-actions"/>
      </div>
    </header>

    <main class="flex-grow-1">
      <div class="container py-4">
        <t t-slot="default"/>
      </div>
    </main>

    <footer class="base-footer text-center py-3 glass-header">
      <small>© 2025 Meliora Gym. All rights reserved.</small>
    </footer>
  </div>
`;
}

// Register this layout for reuse if needed in registry
registry.category("public_components").add("gym_meliora.BaseLayout", BaseLayout);
