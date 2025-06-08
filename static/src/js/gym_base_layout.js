/** @odoo-module **/

import { Component, xml } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class BaseLayout extends Component {
    static template = xml/* xml */`
        <main class="meliora-root">
            <section class="section">
                <div class="container">
                    <t t-slot="default"/>
                </div>
            </section>
        </main>
    `;
}

registry.category("public_components").add("gym_meliora.BaseLayout", BaseLayout);