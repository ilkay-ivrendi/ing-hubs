import { LitElement, css, html } from "lit";

export class Pagination extends LitElement {
    static properties = {
        currentPage: { type: Number },
        totalPages: { type: Number }
    }

    constructor() {
        super();
        this.currentPage = 1;
        this.totalPages = 1;
    }

    goToPage(pageNumber) {
        console.log("should change page", pageNumber);
        this.dispatchEvent(new CustomEvent('page-change', {
            detail: { pageNumber },
            bubbles: true,
            compose: true
        }));
    }

    render() {
        return html`
            <div class="pagination-controls">
                <button @click="${() => this.goToPage(this.currentPage - 1)}" ?disabled="${this.currentPage <= 1}">
                    Previous
                </button>

                ${Array.from({ length: this.totalPages }, (ignoredValue, index) => index + 1).map(page => html`
                    <button @click="${() => this.goToPage(page)}"
                        ?disabled="${this.currentPage === page}"
                        class="${this.currentPage === page ? 'active' : ''}">
                        ${page}
                    </button>
                `)}

                <button @click="${() => this.goToPage(this.currentPage + 1)}" ?disabled="${this.currentPage >= this.totalPages}">
                    Next
                </button>
            </div>
        `
    }

    static styles = css`
    .pagination-controls {
      margin-top: 1em;
      text-align: center;
    }

    .pagination-controls button {
      padding: 0.5em 1em;
      margin: 0 0.5em;
      cursor: pointer;
      background-color: #ff6303;
      color: white;
      border: none;
      border-radius: 5px;
    }

    .pagination-controls button[disabled] {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .pagination-controls button.active {
      background-color: #ff9136;
      font-weight: bold;
    }
  `;
}

customElements.define('pagination-component', Pagination);