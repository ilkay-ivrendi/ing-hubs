import { LitElement, html, css } from 'lit';
import { changeLanguage } from '../i18n/translation-helper.js';
import trFlag from 'flag-icons/flags/4x3/tr.svg';
import enFlag from 'flag-icons/flags/4x3/gb.svg';

export class LanguageSelector extends LitElement {
  static properties = {
    lang: { type: String },
  };

  constructor() {
    super();
    this.lang = document.documentElement.lang || 'en';
  }

  connectedCallback() {
    super.connectedCallback();
    const storedLang = localStorage.getItem('lang');
    if (storedLang) {
      this.lang = storedLang;
    }
  }

  handleLanguageChange(lang) {
    changeLanguage(lang).then(() => {
      this.lang = lang;
      this.requestUpdate();

      this.dispatchEvent(new CustomEvent('language-changed', {
        detail: { lang },
        bubbles: true,
        composed: true
      }));
    });
  }

  render() {
    return html`
        <div class="language-selector">
          <button class="lang-btn">
            <img src=${this.lang === 'tr' ? trFlag : enFlag} width="25" />
          </button>
          <div class="lang-dropdown">
            <img src=${trFlag} width="25" @click="${() => this.handleLanguageChange('tr')}" />
            <img src=${enFlag} width="25" @click="${() => this.handleLanguageChange('en')}" />
          </div>
        </div>
      `;
  }

  static styles = css`
      .language-selector {
        position: relative;
        display: inline-block;
      }
  
      .lang-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        margin-top: 5px;
      }
  
      .lang-dropdown {
        display: none;
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        padding: 5px;
        z-index: 10;
        border-radius: 5px;
        width: 30px;
      }
  
      .language-selector:hover .lang-dropdown {
        display: block;
      }
  
      .lang-dropdown img {
        cursor: pointer;
        padding: 3px;
        transition: transform 0.2s;
      }
  
      .lang-dropdown img:hover {
        transform: scale(1.1);
      }
    `;
}

customElements.define('language-selector', LanguageSelector);