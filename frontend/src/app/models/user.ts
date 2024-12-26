import { Role } from './auth.model';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
