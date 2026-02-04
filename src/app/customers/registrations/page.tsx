import RequireAuth from '@/components/auth/RequireAuth';
import { CustomerRegistrationList } from '@/components/customers/registration/CustomerRegistrationList';

export const metadata = {
  title: 'Customer Registrations - Registrasi Member Ekatunggal',
  description: 'Kelola pengajuan registrasi member dari customer',
};

export default function CustomerRegistrationsPage() {
  return (
    <RequireAuth>
      <CustomerRegistrationList />
    </RequireAuth>
  );
}
