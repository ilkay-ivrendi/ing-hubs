import { LitElement, css, html } from 'lit';
import { store } from '../store/store.js';
import { setEmployees, deleteEmployee, updateEmployee } from '../store/employee-slice.js';
import { Router } from '@vaadin/router';

import 'fa-icons';
import '../components/confirm-modal.js';
import '../components/pagination.js';

export class EmployeesView extends LitElement {

    static properties = {
        employees: { type: Array },
        currentPage: { type: Number },
        itemsPerPage: { type: Number }
    };


    constructor() {
        super()
        this.employees = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;

        store.subscribe(() => {
            const state = store.getState();
            console.log("subscribed to store", state);
            this.employees = state.employees.list;
        });
    }

    async firstUpdated() {
        const state = store.getState();
        console.log("firstUpdated", state);
        if (!state.employees.initialized) {
            const response = await fetch('/src/MOCK_DATA.json');
            const data = await response.json();
            store.dispatch(setEmployees(data));
            console.log("Not Initialized, data is fetched from MOCK_JSON");
        } else {
            this.employees = state.employees.list;
        }
    }

    get currentPageData() {
        if (!this.employees) return [];
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.employees.slice(startIndex, endIndex);
    }

    onPageChange(event) {
        this.currentPage = event.detail.pageNumber;
    }

    onDeleteEmployee(employee) {
        const fullName = `${employee.first_name} ${employee.last_name}`;

        const dialog = this.shadowRoot.getElementById('confirm-delete');
        dialog.openModal(`Selected employee record of ${fullName} will be deleted`);

        dialog.addEventListener('confirmModal', () => {
            store.dispatch(deleteEmployee(employee.id));
        }, { once: true }); 
        console.log("Delete Employee Success", employee.id);
    }

    onEditEmployee(employeeId) {
        console.log("Edit Employe", employeeId);
        Router.go(`/employees/${employeeId}/edit`);
    }

    onActionButtonClick() {
        console.log("Button Clicked!!");
    }


    render() {
        return html`
        <div class="page-header">
           <h2 class="page-title">Employee List</h2>
           <div class="action-buttons-container">
            <button class="action-button"> <fa-icon class="fas fa-bars"></fa-icon> </button>
            <button class="action-button" @click=${this.onActionButtonClick}> <fa-icon class="fas fa-th"></fa-icon> </button>
           </div>
        </div>

           <table>
            <thead>
                <tr>
                    <th><input type="checkbox" class="table-checkbox"></th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Date of Employment</th>
                    <th>Date of Birth</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Actions</th>
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

       <pagination-component
            .currentPage="${this.currentPage}"
            .totalPages="${Math.ceil(this.employees.length / this.itemsPerPage)}"
            @page-change="${this.onPageChange}"
        >
        </pagination-component>

        <confirm-modal id="confirm-delete"></confirm-modal>

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
    `;
}

window.customElements.define('employees-view', EmployeesView);