import { LitElement, css, html } from 'lit'
import 'fa-icons';

import ingLogo from '../assets/ing-logo.png'
import agentIcon from '../assets/callcenter-agent.png'
import trFlag from 'flag-icons/flags/4x3/tr.svg';

export class AppNavigation extends LitElement {
    static properties = {
        currentPath: { type: String },
    };

    constructor() {
        super();
        // Initialize with default path or get from router if available
        window.addEventListener('vaadin-router-location-changed', (event) => {
            this.currentPath = event.detail.location.pathname;
        });
    }

    render() {
        const isEmployeesView = this.currentPath === '/employees';
        return html`
            ${isEmployeesView
                ? html`<h5 class="page-title">Emplooye List (Table View)</h5>`
                : html`<h5 class="page-title">Welcome to ING Hubs</h5>`
            }
            <nav>
                <div class="logo-container">
                    <a href="/" class="icon-link">
                        <img src=${ingLogo} class="nav-logo" >
                        <h3>ING</h3>
                    </a>
                </div>
                
                <div class="menu-items">
                    <a href="/employees" class="icon-link">
                        <img src=${agentIcon} class="nav-logo" >Employees</a>

                    <a href="/create-employee" class="icon-link ${!isEmployeesView ? 'disabled' : ''}">
                        <fa-icon class="fas fa-plus"></fa-icon> Add New</a>

                    <img src=${trFlag} width="25">
                </div> 
            </nav>    
        `
    }

    static styles = css`
    nav {
      background: #ffffff;
      padding: 0.2rem;
      display: flex;
      align-items:center;
      justify-content: space-between;
    }

    .logo-container {
        display:flex;
        align-items:center;
    }

    .nav-logo {
        width: 30px;
        height: 30px;
        border-radius: 5px;
        margin: 0 10px 0 10px;
    }

    .menu-items {
        display:flex;
        gap: 20px;
        margin-right: 10px;

        a {
            color: #ff6303;
            text-decoration: none;
            font-style: inherit;
            font-weight: 600;
        }
    }

    .page-title {
        color: lightgray;
        display: flex;
        margin: 0;
    }

    .icon-link {
        display: flex;
        align-items: center;
        gap: 5px;
        text-decoration: none;
        color:black;
    }

    fa-icon {
        display:flex;
    }

    .icon-link.disabled {
        pointer-events: none;
        opacity: 0.5;
        cursor: not-allowed;
    }

    `;
}

window.customElements.define('app-navigation', AppNavigation);