
import { ServiceOrder, Customer, TillTransaction, Product, Employee } from '../types';

// Minimal data for testing structure, can be deleted via the UI logic if needed
// or start with empty arrays if you prefer a completely clean slate.

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_ORDERS: ServiceOrder[] = [];

export const INITIAL_TILL: TillTransaction[] = [];

// Fix: Export INITIAL_PRODUCTS to resolve the error in components/Products.tsx
export const INITIAL_PRODUCTS: Product[] = [];

// Fix: Export INITIAL_EMPLOYEES to resolve the error in components/Employees.tsx
export const INITIAL_EMPLOYEES: Employee[] = [];
