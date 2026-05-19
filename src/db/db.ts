import Dexie, { type Table } from 'dexie';

export interface Job {
  id?: number;
  image?: string; // Data URL or Blob URL
  customerName: string;
  serviceType: string;
  description: string;
  balanceAmount: number;
  collectionDate: string; // ISO string
  statusOverride?: 'Completed'; // Manual override
  createdAt: number;
}

export interface Customer {
  id?: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: number;
}

export class WorkManagementDB extends Dexie {
  jobs!: Table<Job>;
  customers!: Table<Customer>;

  constructor() {
    super('work_management_db');
    this.version(2).stores({
      jobs: '++id, customerName, serviceType, collectionDate, statusOverride',
      customers: '++id, name, phone, email'
    });
  }
}

export const db = new WorkManagementDB();
