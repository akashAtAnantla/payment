// lib/auth/credentials.ts
import { User } from "@/types";

const users: User[] = [
  {
    id: "user-1",
    name: "Super Admin",
    email: "superadmin@example.com",
    role: "superAdmin",
    password: "superadmin123",
  },
  {
    id: "user-2",
    name: "Merchant 1 Admin",
    email: "merchant1@example.com",
    role: "merchantAdmin",
    merchantId: "merchant-1",
    password: "merchant1pass",
  },
  {
    id: "user-3",
    name: "Merchant 2 Admin",
    email: "merchant2@example.com",
    role: "merchantAdmin",
    merchantId: "merchant-2",
    password: "merchant2pass",
  },
  {
    id: "user-4",
    name: "Merchant 3 Admin",
    email: "merchant3@example.com",
    role: "merchantAdmin",
    merchantId: "merchant-3",
    password: "merchant3pass",
  },
  {
    id: "user-5",
    name: "Merchant 4 Admin",
    email: "merchant4@example.com",
    role: "merchantAdmin",
    merchantId: "merchant-4",
    password: "merchant4pass",
  },
  {
    id: "user-6",
    name: "Merchant 5 Admin",
    email: "merchant5@example.com",
    role: "merchantAdmin",
    merchantId: "merchant-5",
    password: "merchant5pass",
  },
];

export async function authenticate(
  email: string,
  password: string
): Promise<User | null> {
  const user = users.find((u) => u.email === email && u.password === password);
  return user || null;
}
