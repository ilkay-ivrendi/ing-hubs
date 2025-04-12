import { LitElement, css, html } from 'lit';
import { Router } from '@vaadin/router';
import './components/app-navigation.js';
import './pages/home-view.js';
import './pages/employees-view.js';
import './pages/create-employee.js';
import './pages/edit-employee.js';

/**
 * ING-Hubs Employe Management Application
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
      { path: '/create-employee', component: 'create-employee' },
      { path: '/employees/:id/edit', component: 'edit-employee' },
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
