// src/app/branches/page.tsx
import BranchList from '@/components/branches/BranchList';

export const metadata = {
  title: 'Branches - EKA+ Admin',
  description: 'Kelola cabang Ekatunggal di seluruh Indonesia',
};

export default function BranchesPage() {
  return <BranchList />;
}