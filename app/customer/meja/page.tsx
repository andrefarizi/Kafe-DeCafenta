import { getTableList } from '@/src/controllers/table-controller';
import CustomerMejaClient from './CustomerMejaClient';

export const dynamic = 'force-dynamic';

export default async function CustomerMejaPage() {
  const tables = await getTableList();
  return <CustomerMejaClient tables={tables} />;
}
