import { LitElement, css, html } from 'lit'
import ingLogo from '../assets/ing-logo.png'

export class HomeView extends LitElement {

    constructor() {
        super()
    }

    render() {
        return html`
        <div class="home-container">
           <img src=${ingLogo} class="brand-logo" >
           <h1>Welcome to ING-Hubs</h1>
           <h3>Employee Management Application</h3>
        </div>
        `
    }

    static styles = css`
    .home-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin: 2em;
    }

    .brand-logo {
        width: 200px;
        height: 200px;
        border-radius: 25px;
    }
    `;
}

window.customElements.define('home-view', HomeView);