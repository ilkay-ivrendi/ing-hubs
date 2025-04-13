import { LitElement, css, html } from 'lit';
import { store } from '../store/store.js';
import { setEmployees, deleteEmployee } from '../store/employee-slice.js';
import { Router } from '@vaadin/router';
import { t } from '../i18n/translation-helper.js';
import 'fa-icons';

import '../components/search-panel.js';
import '../components/confirm-modal.js';
import '../components/pagination.js';

export class EmployeesView extends LitElement {

    static properties = {
        employees: { type: Array },
        currentPage: { type: Number },
        itemsPerPage: { type: Number },
        searchQuery: { type: String },
        viewMode: { type: String }
    };


    constructor() {
        super()
        this.employees = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.searchQuery = '';

        this.viewMode = localStorage.getItem('viewMode') | 'table';
        if (this.viewMode === 'grid') {
            this.itemsPerPage = 12;
        }


        store.subscribe(() => {
            const state = store.getState();
            this.employees = state.employees.list;
        });

        window.addEventListener('language-changed', () => {
            this.requestUpdate();
        });
    }

    async firstUpdated() {
        const state = store.getState();
        if (!state.employees.initialized) {
            const response = await fetch('/src/MOCK_DATA.json');
            const data = await response.json();
            store.dispatch(setEmployees(data));
            console.log("Not Initialized, data is fetched from MOCK_JSON");
        } else {
            this.employees = state.employees.list;
        }
    }

    get filteredEmployees() {
        if (!this.searchQuery) return this.employees;

        const lowerQuery = this.searchQuery.toLowerCase();
        return this.employees.filter(emp =>
            `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(lowerQuery) ||
            emp.email.toLowerCase().includes(lowerQuery) ||
            emp.phone.toLowerCase().includes(lowerQuery) ||
            emp.department.toLowerCase().includes(lowerQuery) ||
            emp.position.toLowerCase().includes(lowerQuery)
        );
    }

    get currentPageData() {
        const filtered = this.filteredEmployees;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    }

    onPageChange(event) {
        this.currentPage = event.detail.pageNumber;
    }

    onDeleteEmployee(employee) {
        const fullName = `${employee.first_name} ${employee.last_name}`;
        const dialog = this.shadowRoot.getElementById('confirm-delete');
        const message = t('delete_confirm_message').replace('{fullname}', fullName);

        dialog.openModal(message);
        dialog.addEventListener('confirmModal', () => {
            store.dispatch(deleteEmployee(employee.id));
        }, { once: true });
    }

    onEditEmployee(employeeId) {
        Router.go(`/employees/${employeeId}/edit`);
    }

    tableView() {
        console.log("Table View");
        this.viewMode = 'table';
        localStorage.setItem('viewMode', this.viewMode);
        window.dispatchEvent(new CustomEvent('view-mode-changed'));
    }

    gridView() {
        console.log("Grid View");
        this.viewMode = 'grid';
        this.itemsPerPage = 12;
        localStorage.setItem('viewMode', this.viewMode);
        window.dispatchEvent(new CustomEvent('view-mode-changed'));
    }

    renderTableView() {
        return html`
            <table>
                <thead>
                    <tr>
                      <th><input type="checkbox" class="table-checkbox"></th>
                      <th>${t('first_name')}</th>
                      <th>${t('last_name')}</th>
                      <th>${t('date_of_employment')}</th>
                      <th>${t('date_of_birth')}</th>
                      <th>${t('phone')}</th>
                      <th>${t('email')}</th>
                      <th>${t('department')}</th>
                      <th>${t('position')}</th>
                      <th>${t('actions')}</th>
                    </tr>
                </thead>
              <tbody>
                ${this.currentPageData.map((employee) => html`
                    <tr>
                       <td><input type="checkbox" class="table-checkbox"></td>
                       <td>${employee.first_name}</td>
                       <td>${employee.last_name}</td>
                       <td>${employee.employment_date}</td>
                       <td>${employee.birth_date}</td>
                       <td>${employee.phone}</td>
                       <td>${employee.email}</td>
                       <td>${employee.department}</td>
                       <td>${employee.position}</td>
                       <td>
                           <button class="action-button"  @click="${() => this.onEditEmployee(employee.id)}"><fa-icon class="fas fa-edit"></fa-icon></button>
                           <button class="action-button" @click="${() => this.onDeleteEmployee(employee)}"><fa-icon class="fas fa-trash"></fa-icon></button>
                       </td>
                    </tr>
                  `
        )}
              </tbody>
            </table>
            `
    }

    renderGridView() {
        return html`
            <div class="grid-container">
              ${this.currentPageData.map((employee) => html`
                <div class="employee-card">
                  <div><strong><h3>${employee.first_name} ${employee.last_name}</h3></strong></div>
                  <div><strong>${t('email')}:</strong> ${employee.email}</div>
                  <div><strong>${t('phone')}:</strong> ${employee.phone}</div>
                  <div><strong>${t('date_of_employment')}:</strong> ${employee.employment_date}</div>
                  <div><strong>${t('date_of_birth')}:</strong> ${employee.birth_date}</div>
                  <div><strong>${t('department')}:</strong> ${employee.department}</div>
                  <div><strong>${t('position')}:</strong> ${employee.position}</div>
                  <div class="grid-actions">
                    <button class="action-button" @click="${() => this.onEditEmployee(employee.id)}">
                      <fa-icon class="fas fa-edit"></fa-icon>
                    </button>
                    <button class="action-button" @click="${() => this.onDeleteEmployee(employee)}">
                      <fa-icon class="fas fa-trash"></fa-icon>
                    </button>
                  </div>
                </div>
              `)}
            </div>
           `;
    }


    render() {
        return html`
        <div class="page-header">
           <h2 class="page-title">${t('employees_page_title')}</h2>
           <div class="action-buttons-container">
            <search-panel .query=${this.searchQuery} @search-changed=${e => this.searchQuery = e.detail.query}></search-panel>
            <button class="action-button" @click=${this.tableView}> <fa-icon class="fas fa-bars"></fa-icon> </button>
            <button class="action-button" @click=${this.gridView}> <fa-icon class="fas fa-th"></fa-icon> </button>
           </div>
        </div>

        ${this.viewMode === 'table' ? this.renderTableView() : this.renderGridView()}

       <pagination-component
            .currentPage="${this.currentPage}"
            .totalPages="${Math.ceil(this.employees.length / this.itemsPerPage)}"
            @page-change="${this.onPageChange}"
        >
        </pagination-component>

        <confirm-modal id="confirm-delete" .title="${t('confirm_modal_title')}"></confirm-modal>

        `;
    }

    static styles = css`
    .page-header {
        color:#ff6303;
        margin: 2em 0em;
        display:flex;
        align-items:center;
        justify-content: space-between;
    }

    table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
        background: white;
    }

    th {
        text-align: left;
        padding: 8px;
        color: #ff6303;
        font-size: 14px;
        margin: 2rem;
    }
    td {
        text-align: left;
        padding: 8px;
    }

    .action-buttons-container {
        display:flex;
    }

    .action-button {
        color: #ff6303;
        width: 40px;
        height: 40px;
        border: none;
        background: transparent;
        cursor: pointer;
    }

    .action-button:hover {
        background-color: white;
        color: #ff6303;;
        border: 1px solid #ff6303;
    }

    .table-checkbox {
        -webkit-appearance: none; /* For Safari */
        -moz-appearance: none; /* For Firefox */
        appearance: none; /* Standard for modern browsers */
        width: 20px;
        height: 20px;
        border: 2px solid lightgray;
        border-radius: 5px; /* Smooth corners */
        transition: border-color 0.3s, background-color 0.3s;
        cursor: pointer;
    }

    .table-checkbox:checked {
        border-color: #ff6303;;
    }

    .table-checkbox:checked::after {
        content: '✔';  /* The checkmark symbol */
        text-align: center;
        font-size: 15px;
        color: #ff6303;;
        line-height: 20px; /* Center the tick vertically */
        margin-left:2px;
        position: absolute;
    }

    .table-checkbox:hover {
        border-color: #ff6303;;
    }

    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .employee-card {
        background: white;
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        max-width: 350px;
    }

    .grid-actions {
        margin-top: 0.5rem;
        display: flex;
        gap: 0.5rem;
        justify-content:end;
    }
    `;
}

window.customElements.define('employees-view', EmployeesView);