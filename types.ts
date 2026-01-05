
export enum TransactionType {
  WITHDRAWAL = 'WITHDRAWAL',
  DEPOSIT = 'DEPOSIT'
}

export enum DeliveryStatus {
  ON_WAY = 'On the way to the delivery company',
  NOT_COLLECTED = 'Not yet collected at the delivery company',
  COLLECTED = 'Collected at the delivery company'
}

export interface ServiceOrder {
  id: string;
  customerName: string; // Manually entered text
  description: string;
  quantity: number;
  totalPurchaseCost: number; // Cost of materials
  printingCost: number; // Cost of customization
  totalSellingPrice: number;
  date: string;
  profit: number;
  margin: number;
  status: DeliveryStatus;
}

export interface TillTransaction {
  id: string;
  personName: string;
  amount: number;
  reason: string;
  type: TransactionType;
  date: string;
}

export interface RegularCustomer {
  name: string;
  orderCount: number;
  totalSpent: number;
  totalProfit: number;
}

// Added Customer interface
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Added PrintingCost interface
export interface PrintingCost {
  ink: number;
  paper: number;
  machine: number;
  labor: number;
}

// Added Product interface
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  baseCost: number;
  isPrinted: boolean;
  sellingPrice: number;
  stock: number;
  printingCostDetails: PrintingCost;
}

// Added Employee interface
export interface Employee {
  id: string;
  name: string;
  role: string;
  baseSalary: number;
  commissionRate: number;
  joinedDate: string;
  avatar: string;
}
