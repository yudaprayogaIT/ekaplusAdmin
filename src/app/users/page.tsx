// src/app/users/page.tsx
import UserList from '@/components/users/UserList';

export const metadata = {
  title: 'Users - EKA+ Admin',
  description: 'Kelola pengguna aplikasi EKA+',
};

export default function UsersPage() {
  return <UserList />;
}