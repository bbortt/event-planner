export class Role {
  static ADMIN: InternalRole = {
    name: 'ADMIN',
    i18nKey: 'eventPlannerApp.role.admin',
  }

  static SECRETARY: InternalRole = {
    name: 'SECRETARY',
    i18nKey: 'eventPlannerApp.role.secretary',
  }

  static CONTRIBUTOR: InternalRole = {
    name: 'CONTRIBUTOR',
    i18nKey: 'eventPlannerApp.role.contributor',
  }

  static VIEWER: InternalRole = {
    name: 'VIEWER',
    i18nKey: 'eventPlannerApp.role.viewer',
  }
}

export const ROLES: InternalRole[] = [Role.ADMIN, Role.SECRETARY, Role.CONTRIBUTOR, Role.VIEWER];

export interface InternalRole {
  /**
   * Uniquely identifies a role.
   */
  name: string;

  /**
   * Fully qualified i18n key.
   */
  i18nKey: string;
}
