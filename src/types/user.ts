// types/user.ts

export interface RawData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  dateRegist: number;
}

export interface NewData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  dateRegist: string;
}
