import { Badge } from '../ui/badge';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/card';
import { DataTable } from '../shared/DataTable';

const stageGuide = [
  { no: 'Stage 1', name: 'Concept Design', duration: '2-3 Weeks', approvalRequired: 'YES - Concept Approval', disciplines: 'Structural, Architectural, Electrical, PEB' },
  { no: 'Stage 2', name: 'Scheme Design', duration: '3-4 Weeks', approvalRequired: 'YES - Scheme Approval', disciplines: 'Structural, Architectural, Electrical, PEB' },
  { no: 'Stage 3', name: 'Preliminary Design', duration: '2-4 Weeks', approvalRequired: 'YES - Prelim. Design Approval', disciplines: 'Structural, Architectural' },
  { no: 'Stage 4', name: 'Structural Design', duration: '3-6 Weeks', approvalRequired: 'YES - Design Approval', disciplines: 'Structural Engineering, PEB' },
  { no: 'Stage 5', name: 'Working Drawings', duration: '4-8 Weeks', approvalRequired: 'YES - WD Approval for GFC', disciplines: 'All Disciplines' },
  { no: 'Stage 6', name: 'Detailed Engineering', duration: '4-8 Weeks', approvalRequired: 'YES - Detailed Engg Approval', disciplines: 'Structural, Electrical, PEB' },
  { no: 'Stage 7', name: 'GFC Drawings', duration: '2-4 Weeks', approvalRequired: 'YES - GFC Approval (CRITICAL)', disciplines: 'All Disciplines' },
  { no: 'Stage 8', name: 'Shop Drawings', duration: '3-5 Weeks', approvalRequired: 'YES - Shop Drawing Approval', disciplines: 'PEB, Structural (Steel)' },
  { no: 'Stage 9', name: 'Site Supervision', duration: 'Duration of construction', approvalRequired: 'NO - Ongoing support', disciplines: 'All Disciplines' },
  { no: 'Stage 10', name: 'As-Built Drawings', duration: '3-4 Weeks post completion', approvalRequired: 'YES - As-Built Approval', disciplines: 'All Disciplines' },
  { no: 'Stage 11', name: 'Project Handover', duration: '1-2 Weeks', approvalRequired: 'YES - Handover Acceptance', disciplines: 'All Disciplines' },
];

export function StageGuideCard() {
  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle>Stage Guide</CardTitle>
        <Badge tone="amber">Reference</Badge>
      </CardHeader>
      <CardBody className="max-h-[calc(100vh-240px)] overflow-auto p-0">
        <DataTable
          columns={[
            { key: 'no', label: 'Stage' },
            { key: 'name', label: 'Name' },
            { key: 'approvalRequired', label: 'Approval' },
            { key: 'disciplines', label: 'Disciplines' },
            { key: 'duration', label: 'Duration' },
          ]}
          rows={stageGuide}
          rowKey={(row) => row.no}
        />
      </CardBody>
    </Card>
  );
}
