export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
};

export const ROLE_LABELS = {
  superadmin: 'Superadmin',
  admin: 'Admin',
  employee: 'Employee',
};

export const ROLE_COLORS = {
  superadmin: '#F0A428',
  admin: '#2E83F5',
  employee: '#22C97A',
};

export function canDo(userRole, action) {
  const permissions = {
    createProject: ['superadmin', 'admin'],
    deleteProject: ['superadmin'],
    assignTask: ['superadmin', 'admin'],
    approveStage: ['superadmin'],
    inviteMember: ['superadmin', 'admin'],
    addEmployee: ['superadmin', 'admin'],
    deleteEmployee: ['superadmin'],
    viewCEODash: ['superadmin'],
    viewAllProjects: ['superadmin', 'admin'],
    viewReports: ['superadmin', 'admin'],
    viewBilling: ['superadmin', 'admin'],
  };

  return permissions[action]?.includes(userRole) ?? false;
}

export function getHomePathForRole(role) {
  if (role === 'superadmin') return '/dashboard';
  if (role === 'admin') return '/projects';
  return '/my-tasks';
}
