import { LitElement, css, html } from 'lit'
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
    }

    async firstUpdated() {
        const response = await fetch('/src/MOCK_DATA.json');
        const data = await response.json();
        this.employees = data;
    }

    get currentPageData() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.employees.slice(startIndex, endIndex);
    }

    onPageChange(event) {
        this.currentPage = event.detail.pageNumber;
        console.log("page change", this.currentPage);
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
                    <th><input type="checkbox"></th>
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
                    <td><input type="checkbox"></td>
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

    onActionButtonClick() {
        console.log("Button Clicked!!");
    }

    onDeleteEmployee(employee) {
        console.log("Delete Employee", employee.id);
        const fullName = `${employee.first_name} ${employee.last_name}`;
        const dialog = this.shadowRoot.getElementById('confirm-delete');
        dialog.openModal(`Selected employee record of ${fullName} will be deleted`);

        dialog.addEventListener('confirmModal', () => {
            this.employees = this.employees.filter(e => e.id !== this.selectedEmployeeId);
        }, { once: true }); // prevent multiple triggers
    }

    onEditEmployee(employeId) {
        console.log("Edit Employe", employeId);
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
        color:rgb(200, 77, 0);
        border: 1px solid #ff6303;
    }
    `;
}

window.customElements.define('employees-view', EmployeesView);