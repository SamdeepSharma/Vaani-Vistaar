import { v4 as uuidv4 } from 'uuid';

interface TempUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  otp: string;
  otpExpires: Date;
}

const tempUsers: TempUser[] = [];

export async function createTempUser(userData: Omit<TempUser, 'id'>): Promise<string> {
  const id = uuidv4();
  const tempUser: TempUser = { id, ...userData };
  tempUsers.push(tempUser);
  return id;
}

export async function getTempUser(id: string): Promise<TempUser | undefined> {
  return tempUsers.find(user => user.id === id);
}

export async function deleteTempUser(id: string): Promise<void> {
  const index = tempUsers.findIndex(user => user.id === id);
  if (index !== -1) {
    tempUsers.splice(index, 1);
  }
}