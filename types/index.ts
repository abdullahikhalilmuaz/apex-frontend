export interface User {
  id: string;
  name: string;
  email: string;
  role: 'headmaster' | 'teacher' | 'parent';
  schoolId: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'headmaster' | 'teacher' | 'parent';
  schoolName?: string;
  phone?: string;
  classAssigned?: string;
  subjects?: string[];
  relationship?: string;
}