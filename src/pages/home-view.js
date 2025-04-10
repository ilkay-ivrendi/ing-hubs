import { LitElement, css, html } from 'lit'
export class HomeView extends LitElement {

    constructor() {
        super()
    }

    render() {
        return html`
           <h1>Welcome to ING-Hubs</h1>
           <h3>Employee Management Application</h3>
        `
    }

    static styles = css`
    
    `;
}

window.customElements.define('home-view', HomeView);