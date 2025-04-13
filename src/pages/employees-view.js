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
        viewMode: { type: String },
        selectedEmployeeIds: { type: Array },
    };


    constructor() {
        super()
        this.employees = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.searchQuery = '';
        this.selectedEmployeeIds = []

        this.viewMode = localStorage.getItem('viewMode') || 'table';
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
        this.viewMode = 'table';
        localStorage.setItem('viewMode', this.viewMode);
        window.dispatchEvent(new CustomEvent('view-mode-changed'));
    }

    gridView() {
        this.viewMode = 'grid';
        this.itemsPerPage = 12;
        localStorage.setItem('viewMode', this.viewMode);
        window.dispatchEvent(new CustomEvent('view-mode-changed'));
    }

    toggleCheckbox(event, id) {
        const checkbox = event.currentTarget.querySelector('.table-checkbox');
        if (!checkbox) return;

        checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
            this.selectedEmployeeIds = [...this.selectedEmployeeIds, id];
        } else {
            this.selectedEmployeeIds = this.selectedEmployeeIds.filter(empId => empId !== id);
        }

        this.requestUpdate();
    }

    toggleSelectAll(event) {
        const isChecked = event.target.checked;

        if (isChecked) {
            this.selectedEmployeeIds = this.currentPageData.map(emp => emp.id);
        } else {
            this.selectedEmployeeIds = [];
        }

        console.log("select all clicked");

        this.requestUpdate();
    }

    renderTableView() {
        return html`
        <div class="responsive-table">
            <table>
                <thead>
                    <tr>
                      <th><input type="checkbox" class="table-checkbox" @change="${this.toggleSelectAll}"></th>
                      <th>${t('first_name')}</th>
                      <th>${t('last_name')}</th>
                      <th class="fixed">${t('date_of_employment')}</th>
                      <th class="fixed">${t('date_of_birth')}</th>
                      <th>${t('phone')}</th>
                      <th>${t('email')}</th>
                      <th>${t('department')}</th>
                      <th>${t('position')}</th>
                      <th class="fixed">${t('actions')}</th>
                    </tr>
                </thead>
              <tbody>
                ${this.currentPageData.map((employee) => html`
                    <tr @click="${(event) => this.toggleCheckbox(event, employee.id)}">
                       <td class="checkbox-row" > 
                            <input type="checkbox" class="table-checkbox" 
                            .checked=${this.selectedEmployeeIds.includes(employee.id)}
                            @click="${(event) => event.stopPropagation()}">
                       </td>
                       <td class="first-name-row">${employee.first_name}</td>
                       <td class="last-name-row">${employee.last_name}</td>
                       <td class="doe-row">${employee.employment_date}</td>
                       <td class="dob-row">${employee.birth_date}</td>
                       <td class="phone-row">${employee.phone}</td>
                       <td class="email-row">${employee.email}</td>
                       <td class="department-row">${employee.department}</td>
                       <td class="position-row">${employee.position}</td>
                       <td class="actions-row">
                           <button class="action-button"  @click="${() => this.onEditEmployee(employee.id)}"><fa-icon class="fas fa-edit"></fa-icon></button>
                           <button class="action-button" @click="${() => this.onDeleteEmployee(employee)}"><fa-icon class="fas fa-trash"></fa-icon></button>
                       </td>
                    </tr>
                  `
        )}
              </tbody>
            </table>
            </div>
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
            .totalPages="${Math.ceil(this.filteredEmployees.length / this.itemsPerPage)}"
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

    .responsive-table {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .responsive-table table {
        width: 100%;
        border-collapse: collapse;
        min-width: 600px;
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

    tbody tr:hover {
        background:rgb(249, 123, 45);
        cursor: pointer;
        color: white;

        .table-checkbox:checked {
            border-color: white;
        }

        .table-checkbox:checked::after {
            color: white;;
        }

        .table-checkbox:hover {
            border-color: white;
        }

        .action-button { 
            color: white;
        }

        .action-button:hover {
            background-color: white;
            color: #ff6303;;
            border: 1px solid #ff6303;
        }
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

    .phone-row {
        min-width: 150px;
    }

    .fixed {
        min-width: 100px;
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