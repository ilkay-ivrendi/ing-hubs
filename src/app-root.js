import { LitElement, css, html } from 'lit';
import { Router } from '@vaadin/router';
import './app-navigation.js';
import './pages/home-view.js';
import './pages/employees-view.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class AppRoot extends LitElement {
  constructor() {
    super()
  }

  firstUpdated() {
    const outlet = this.renderRoot.querySelector('#outlet');
    const router = new Router(outlet);
    router.setRoutes([
      { path: '/', component: 'home-view' },
      { path: '/employees', component: 'employees-view' },
      { path: '/settings', component: 'settings-view' },
    ]);
  }

  render() {
    return html`
      <div class="container">
        <app-navigation></app-navigation>
        <div id="outlet"></div>

        <div class="card">
          <slot></slot>
        </div>

      </div>
    `
  }

  static get styles() {
    return css`
      .material-icons {
      font-size: 20px;
      margin-right: 8px;
    }
    `
  }
}

window.customElements.define('app-root', AppRoot)
