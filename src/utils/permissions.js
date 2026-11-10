const PERMS = {
  admin: ['project:edit', 'project:delete', 'member:manage', 'ticket:create', 'ticket:edit', 'ticket:delete:any', 'comment:create'],
  manager: ['project:edit', 'member:manage', 'ticket:create', 'ticket:edit', 'ticket:delete:any', 'comment:create'],
  developer: ['ticket:create', 'ticket:edit', 'comment:create'],
  viewer: [],
};

export const getRole = (project, userId) =>
  project.owner._id === userId ? 'admin' : (project.roles || {})[userId] || 'developer';

export const can = (role, perm) => PERMS[role].includes(perm);