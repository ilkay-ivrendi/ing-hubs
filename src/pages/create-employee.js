import { LitElement, css, html } from 'lit'
import { store } from '../store/store.js';
import { addEmployee } from '../store/employee-slice.js';
import { Router } from '@vaadin/router';

export class CreateEmployee extends LitElement {
    static properties = {
        firstName: { type: String },
        lastName: { type: String },
        dateOfEmployment: { type: String },
        dateOfBirth: { type: String },
        phoneNumber: { type: String },
        email: { type: String },
        department: { type: String },
        position: { type: String },
        error: { type: String }
    }

    constructor() {
        super()
        this.firstName = '';
        this.lastName = '';
        this.dateOfBirth = '';
        this.dateOfEmployment = '';
        this.dateOfBirth = '';
        this.phoneNumber = '';
        this.email = '';
        this.department = '';
        this.position = '';
        this.error = '';
    }

    validate() {
        if (!this.firstName || !this.lastName || !this.dateOfEmployment || !this.dateOfBirth || !this.phoneNumber || !this.email) {
            this.error = "Please fill in all required fields";
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            this.error = "Invalid email format.";
            return false;
        }

        const employees = store.getState().employees.list;
        const dublicate = employees.find(employe => employe.email === this.email);
        if (dublicate) {
            this.error = "An Employee with this email already exists";
        }

        return true;
    }

    handleSubmit(event) {
        event.preventDefault();

        if (!this.validate()) return;

        const newEmployee = {
            id: Date.now(),
            first_name: this.firstName,
            last_name: this.lastName,
            birth_date: this.dateOfBirth,
            employment_date: this.dateOfEmployment,
            phone: this.phoneNumber,
            email: this.email,
            department: this.department,
            position: this.position
        }

        store.dispatch(addEmployee(newEmployee));
        Router.go('/employees');
    }

    render() {
        return html`
        <div class="create-employee-container">
            <div class='create-employee-form'>
              <h2 class="form-title">Create New Employee</h2>
              <form @submit="${this.handleSubmit}">
                <label class="form-label">First Name</label>
                <input class="form-input" type="text" placeholder="John" .value="${this.firstName}" @input="${e => this.firstName = e.target.value}" required />
                
                <label class="form-label">Last Name</label>
                <input class="form-input" type="text" placeholder="Doe" .value="${this.lastName}" @input="${e => this.lastName = e.target.value}" required />
                
                <label class="form-label">Date of Employment</label>
                <input class="form-input" type="date" placeholder="Date of Employment" .value="${this.dateOfEmployment}" @input="${e => this.dateOfEmployment = e.target.value}" required />
                
                <label class="form-label">Date of Birth</label>
                <input class="form-input" type="date" placeholder="Date of Birth" .value="${this.dateOfBirth}" @input="${e => this.dateOfBirth = e.target.value}" required />
                
                <label class="form-label">Phone Number</label>
                <input class="form-input" type="tel" placeholder="+90 532 123 45 67" .value="${this.phoneNumber}" @input="${e => this.phoneNumber = e.target.value}" required />
                
                <label class="form-label">Email Address</label>
                <input class="form-input" type="email" placeholder="john.doe@mymail.com" .value="${this.email}" @input="${e => this.email = e.target.value}" required />

                <label class="form-label">Department</label>
                <select class="form-select" .value="${this.department}" @change="${e => this.department = e.target.value}">
                    <option value="" disabled selected>--Select--</option>    
                    <option value="Analytics">Analytics</option>
                    <option value="Tech">Tech</option>
                </select>
                
                <label class="form-label">Position</label>
                <select class="form-select" .value="${this.position}" @change="${e => this.position = e.target.value}">
                    <option value="" disabled selected>--Select--</option>
                    <option value="Junior">Junior</option>
                    <option value="Medior">Medior</option>
                    <option value="Senior">Senior</option>
                </select>

                ${this.error ? html`<p class='error'>${this.error}></p> ` : ''}

                <button class="submit-btn" type="submit">Create Employee</button>
              </form>

           </div>
        </div>
        `
    }

    static styles = css`
  .create-employee-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2em;
  }

  .create-employee-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 500px;
    padding: 2rem;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }

  .form-title{
    color:#ff6303;
  }

  .form-label {
    font-weight: 600;
    margin-bottom: 0.3rem;
    color: #333;
  }

  .form-input,
  .form-select {
    display:block;
    padding: 0.6rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: #fafafa;
    transition: border-color 0.2s;
    margin-bottom: 15px;
    width: 320px;
    max-width: 320px;
  }

  .form-input:focus,
  .form-select:focus {
    border-color: #ff6303;
    outline: none;
    background: #fff;
  }

  .error {
    color: red;
    font-weight: 600;
    margin-top: 0.2rem;
  }

  .submit-btn {
    display: block;
    padding: 0.8rem;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    background-color: #ff6303;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 50%;
    margin: 1rem auto 0 auto;
  }

  .submit-btn:hover {
    background-color: #ff9136;
  }
`;
}

window.customElements.define('create-employee', CreateEmployee);