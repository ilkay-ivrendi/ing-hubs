import { LitElement, css, html } from 'lit'
import { store } from '../store/store.js';
import { updateEmployee } from '../store/employee-slice.js';
import { Router } from '@vaadin/router';
import { t } from '../i18n/translation-helper.js';

export class EditEmployee extends LitElement {
    static properties = {
        employeeId: { type: String },
        employeeData: { type: Object },
    }

    constructor() {
        super();
        this.employeeId = null;
        this.employeeData = {};

        window.addEventListener('vaadin-router-location-changed', (event) => {
            const location = event.detail.location;
            const id = location.params?.id;
            this.setEmployeeId(id);
        });

        window.addEventListener('language-changed', () => {
          this.requestUpdate(); 
        });
    }

    setEmployeeId(employeeId) {
        this.employeeId = employeeId;
        this.fetchEmployeeData();
    }

    fetchEmployeeData() {
        const employee = store.getState().employees.list.find(e => e.id == this.employeeId);
        if (employee) {
            this.employeeData = { ...employee }; 
        }
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        this.employeeData[name] = value;
    }

    handleSubmit(event) {
        event.preventDefault();
        store.dispatch(updateEmployee({
            id: this.employeeId,
            updatedData: this.employeeData,
        }));
        Router.go('/employees');
    }

    formatDateForInput(dateString) {
        if (!dateString) return '';
        const [day, month, year] = dateString.split('/');
        const date = new Date(`${year}-${month}-${day}`);
        const formattedDate = date.toISOString().split('T')[0];
        return formattedDate;
    }

    handleDateChange(event, field) {
        const [year, month, day] = event.target.value.split('-');
        const formattedDate = `${day}/${month}/${year}`;

        this.employeeData = {
            ...this.employeeData,
            [field]: formattedDate, 
        };
    }


    render() {
        return html`
         <div class="edit-employee-container">
            <div class='edit-employee-form'>
                <h2 class="form-title">${t('edit_employee_title')}</h2>
                <form @submit="${this.handleSubmit}">
                  <label class="form-label">${t('first_name')}</label>
                  <input class="form-input" type="text" name="first_name" .value="${this.employeeData.first_name}" @input="${this.handleInputChange}" required />

                  <label class="form-label">${t('last_name')}</label>
                  <input class="form-input" type="text" name="last_name" .value="${this.employeeData.last_name}" @input="${this.handleInputChange}" required />

                  <label class="form-label">${t('date_of_employment')}</label>
                  <input class="form-input" type="date" .value="${this.formatDateForInput(this.employeeData.employment_date)}" @input="${(e) => this.handleDateChange(e, 'employment_date')}"required />
                
                  <label class="form-label">${t('date_of_birth')}</label>
                  <input class="form-input" type="date" .value="${this.formatDateForInput(this.employeeData.birth_date)}"  @input="${(e) => this.handleDateChange(e, 'birth_date')}"required />
                  
                  <label class="form-label">${t('email')}</label>
                  <input class="form-input" type="email" name="email" .value="${this.employeeData.email}" @input="${this.handleInputChange}" required />

                  <label class="form-label">${t('phone')}</label>
                  <input class="form-input" type="tel" name="phone" .value="${this.employeeData.phone}" @input="${this.handleInputChange}" required />

                  <label class="form-label">${t('department')}</label>
                  <select class="form-input" name="department" .value="${this.employeeData.department}" @change="${this.handleInputChange}">
                    <option value="Analytics">Analytics</option>
                    <option value="Tech">Tech</option>
                  </select>

                  <label class="form-label">${t('position')}</label>
                  <select class="form-input" name="position" .value="${this.employeeData.position}" @change="${this.handleInputChange}">
                    <option value="Junior">Junior</option>
                    <option value="Medior">Medior</option>
                    <option value="Senior">Senior</option>
                  </select>

                  <button class="submit-btn" type="submit" >${t('edit_employee_btn')}</button>
                </form>
            </div>
        </div>
        `;
    }

    static styles = css`
    .edit-employee-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2em;
    }

    .edit-employee-form {
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

window.customElements.define('edit-employee', EditEmployee);