import { LitElement, html, css } from 'lit';
import 'fa-icons';
import { t } from '../i18n/translation-helper.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class ConfirmModal extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    title: { type: String },
    message: { type: String },
  };

  constructor() {
    super();
    this.open = false;
    this.message = '';
    this.title = 'Are you Sure?';
  }

  openModal(message) {
    this.message = message;
    this.open = true;
  }

  closeModal() {
    this.open = false;
  }

  confirmModal() {
    this.dispatchEvent(new CustomEvent('confirmModal', {
      bubbles: true,
      composed: true,
    }));
    this.closeModal();
  }

  render() {
    if (!this.open) return html``;
    return html`
            <div class="modal-backdrop" @click=${this.closeModal}></div>
            <div class="confirm-modal">
              <div class="modal-header">
                  <h3>${this.title}</h3>
                  <fa-icon class="fas fa-times close-modal" @click=${this.closeModal}></fa-icon>
              </div>
              <p>${unsafeHTML(this.message)}</p>
              <div class="actions">
                <button class="confirm-btn" @click=${this.confirmModal}>${t('proceed')}</button>
                <button class="cancel-btn" @click=${this.closeModal}>${t('cancel')}</button>
              </div>
            </div>
          `;
  }

  static styles = css`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 999;
    }

    .confirm-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      width: 500px;
      z-index: 1000;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      color: #ff6303;
    }
        
    .modal-header h3 {
      margin: 0 0 0.5rem;
      text-align: left;
    }

    .actions {
      display: flex;
      flex-direction: column;
      margin-top: 1.5rem;
      gap: 10px;
    }

    button {
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      font-weight: bold;
      cursor: pointer;
    }

    .confirm-btn {
      background: #ff6303;
      color: white;
    }

    .cancel-btn {
      background: #eee;
    }

    .confirm-btn:hover {
      background: #e55a00;
    }

    .cancel-btn:hover {
      background: #ddd;
    }
    
    .close-modal {
      cursor: pointer;
    }

    .close-modal:hover {
      color:  #e55a00;
    }
  `;
}

customElements.define('confirm-modal', ConfirmModal);