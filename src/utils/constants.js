export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  EMPLOYER: 'employer',
};

export const ROLE_OPTIONS = [
  { label: 'Student', value: ROLES.STUDENT },
  { label: 'Admin (HOD)', value: ROLES.ADMIN },
  { label: 'Employer (Verifier)', value: ROLES.EMPLOYER },
];

export const ROUTE_DEFAULTS = {
  [ROLES.STUDENT]: '/student/certificates',
  [ROLES.ADMIN]: '/admin/upload',
  [ROLES.EMPLOYER]: '/employer/verify',
};
