import { LitElement, css, html } from 'lit'
import ingLogo from './assets/ing-logo.png'
import 'fa-icons';
import agentIcon from './assets/callcenter-agent.png'
import trFlag from 'flag-icons/flags/4x3/tr.svg';
// import enFlag from 'flag-icons/flags/1x1/en.svg';

export class AppNavigation extends LitElement {

    constructor() {
        super()
    }

    render() {
        return html`
            <h5 class="page-title">Emplooye List (Table View)</h5>
            <nav>
                <div class="logo-container">
                    <img src=${ingLogo} class="nav-logo" >
                    <h3>ING</h3>
                </div>
                
                <div class="menu-items">
                    <a href="/employees" class="icon-link">
                        <img src=${agentIcon} class="nav-logo" >Employees</a>
                    <a href="#" class="icon-link" @click="${this.onAddNewEmployee}">
                        <fa-icon class="fas fa-plus"></fa-icon> Add New</a>

                    <img src=${trFlag} width="25">
                </div> 
            </nav>    
        `
    }

    onAddNewEmployee() {
        console.log("Add New Employe");
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
    }

    fa-icon {
        display:flex;
    }

    `;
}

window.customElements.define('app-navigation', AppNavigation);