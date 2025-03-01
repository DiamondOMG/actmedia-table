// types/user.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  date: number; // เพิ่มฟิลด์ date เป็น Unix timestamp (มิลลิวินาที)
}

export interface User2 {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  date: string;
}
