// src/components/search-panel.js
import { LitElement, html, css } from 'lit';
import { t } from '../i18n/translation-helper.js';
import 'fa-icons';

export class SearchPanel extends LitElement {
    static properties = {
        open: { type: Boolean },
        query: { type: String },
    };

    constructor() {
        super();
        this.open = false;
        this.query = '';
    }

    togglePanel() {
        this.open = !this.open;
        this.dispatchEvent(new CustomEvent('toggle-search', {
            detail: { open: this.open },
            bubbles: true,
            composed: true
        }));
    }

    handleInput(e) {
        this.query = e.target.value;
        this.dispatchEvent(new CustomEvent('search-changed', {
            detail: { query: this.query },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
      <div class="search-action">
        <input
          class="search-input ${this.open ? 'open' : ''}"
          type="text"
          placeholder="${t('search_placeholder')}"
          .value=${this.query}
          @input=${this.handleInput}
        />
        <button class="search-button" @click=${this.togglePanel}>
          <fa-icon class="fas fa-search"></fa-icon>
        </button>
      </div>
    `;
    }

    static styles = css`

    .search-action {
      display: flex;
      align-items: center;
      position: relative;
    }

    .search-button {
      color: #ff6303;
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      cursor: pointer;
    }

    .search-button:hover {
      background-color: white;
      color: #ff6303;
      border: 1px solid #ff6303;
    }

    .search-input {
      width: 0;
      opacity: 0;
      padding: 0;
      margin-right: 0;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: white;
      color: #333;
      outline: none;
      transition: width 0.3s ease, opacity 0.3s ease, margin-right 0.3s ease, padding 0.3s ease;
    }

    .search-input.open {
      width: 350px;
      opacity: 1;
      padding: 0.4rem 0.6rem;
      margin-right: 10px;
    }
  `;
}

customElements.define('search-panel', SearchPanel);
