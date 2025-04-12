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
        this.dispatchEvent(new CustomEvent('page-change', {
            detail: { pageNumber },
            bubbles: true,
            compose: true
        }));
    }

    getPageNumbers() {
        const pages = [];
        const total = this.totalPages;
        const current = this.currentPage;

        // Always show first page
        pages.push(1);

        // Left-side dots
        if (current > 4) {
            pages.push('...');
        }

        // Determine middle range (around current page)
        const start = Math.max(2, current - 2);
        const end = Math.min(total - 1, current + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Right-side dots
        if (current < total - 3) {
            pages.push('...');
        }

        // Always show last page (if more than 1)
        if (total > 1) {
            pages.push(total);
        }

        return pages;
    }

    render() {
        const pageNumbers = this.getPageNumbers();

        return html`
            <div class="pagination-controls">
                <button @click="${() => this.goToPage(this.currentPage - 1)}" ?disabled="${this.currentPage <= 1}">
                     <fa-icon class="fas fa-angle-left" size="2em"></fa-icon></a>
                </button>

                ${pageNumbers.map(page => {
            return html`
                        <button 
                            @click="${() => page !== '...' && this.goToPage(page)}"
                            ?disabled="${page === '...' || this.currentPage === page}" 
                            class="${this.currentPage === page ? 'active' : ''}">
                            ${page}
                        </button>
                        `;
        })}

                <button @click="${() => this.goToPage(this.currentPage + 1)}" ?disabled="${this.currentPage >= this.totalPages}">
                    <fa-icon class="fas fa-angle-right" size="2em"></fa-icon></a>
                </button>
            </div>
            `
    }

    static styles = css`
        .pagination-controls {
          margin-top: 1em;
          display: flex;
          justify-content: center;
        }   
        .pagination-controls button {
          margin: 0 0.5em;
          width: 30px;
          height: 30px;
          cursor: pointer;
          border: none;
          border-radius: 50%;
        }   
        .pagination-controls button[disabled] {
          cursor: not-allowed;
        }   
        .pagination-controls button.active {
          background-color: #ff9136;
          font-weight: bold;
          color: white;
          padding: 3px;
        }   
        .pagination-controls button fa-icon {
          color: #ff9136;
        }   
        .pagination-controls button[disabled] fa-icon {
          color: gray;
        }   
    `;
}

customElements.define('pagination-component', Pagination);