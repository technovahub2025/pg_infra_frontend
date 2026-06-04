import { DocumentList } from '../upload/DocumentList';

export function EmployeeDocuments({ employeeId }) {
  return <DocumentList employeeId={employeeId} category="all" />;
}
