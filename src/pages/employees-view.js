import { LitElement, css, html } from 'lit'
import 'fa-icons';

export class EmployeesView extends LitElement {

    static properties = {
        employees: { type: Array },
    };


    constructor() {
        super()
        this.employees = [
            {
              id: 101,
              firstName: 'Alfreds',
              lastName: 'Futterkiste',
              employmentDate: '04/06/2022',
              birthDate: '03/03/1992',
              phone: '+(90) 532 123 45 67',
              email: 'alfred@sourtimes.com',
              department: 'Analytics',
              position: 'Junior',
            },
            {
              id: 102,
              firstName: 'Alice',
              lastName: 'Johnson',
              employmentDate: '01/10/2021',
              birthDate: '05/06/1990',
              phone: '+(90) 532 111 22 33',
              email: 'alice@example.com',
              department: 'Development',
              position: 'Senior Developer',
            },
            {
              id: 103,
              firstName: 'Bob',
              lastName: 'Smith',
              employmentDate: '12/12/2020',
              birthDate: '09/09/1988',
              phone: '+(90) 532 222 33 44',
              email: 'bob@example.com',
              department: 'UI/UX',
              position: 'Designer',
            },
          ];
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

            ${this.employees.map((employee) => html`
                <tr>
                    <td><input type="checkbox"></td>
                    <td>${employee.firstName}</td>
                    <td>${employee.lastName}</td>
                    <td>${employee.employmentDate}</td>
                    <td>${employee.birthDate}</td>
                    <td>${employee.phone}</td>
                    <td>${employee.email}</td>
                    <td>${employee.department}</td>
                    <td>${employee.position}</td>
                    <td>
                        <button class="action-button"  @click="${() => this.onEditEmployee(employee.id)}"><fa-icon class="fas fa-edit"></fa-icon></button>
                        <button class="action-button" @click="${() => this.onDeleteEmployee(employee.id)}"><fa-icon class="fas fa-trash"></fa-icon></button>
                    </td>
                </tr>
                `
            )}
            </tbody>
        </table>
        `;
    }

    onActionButtonClick() {
        console.log("Button Clicked!!");
    }

    onDeleteEmployee(employeeId) {
        console.log("Delete Employee", employeeId);
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