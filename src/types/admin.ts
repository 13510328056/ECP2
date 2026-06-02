export type AdminRole = 'super_admin' | 'product_manager' | 'marketing_manager' | 'customer_service' | 'warehouse' | 'finance';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: AdminRole;
  status: 'active' | 'inactive' | 'locked';
  lastLoginAt?: string;
  createdAt: string;
}
