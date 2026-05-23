export interface IUser {
  name: string;
  email: string;
  password: string;  
  role?: string; // admin,agent,user => Task
}