import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  initialized: false
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees(state, action) {
      state.list = action.payload;
      state.initialized = true;
    },
    addEmployee(state, action) {
      state.list.push(action.payload);
    },
    deleteEmployee(state, action) {
      // Remove the employee from the list based on the id
      state.list = state.list.filter(employee => employee.id !== action.payload);
    },
    updateEmployee(state, action) {
      const { id, updatedData } = action.payload;
      const employeeIndex = state.list.findIndex(employee => employee.id == id);

      if (employeeIndex !== -1) {
        state.list[employeeIndex] = { ...state.list[employeeIndex], ...updatedData };
      }
    },
  }
});

export const { setEmployees, addEmployee, deleteEmployee, updateEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;
