import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employee-slice';

export const store = configureStore({
  reducer: {
    employees: employeeReducer
  }
});