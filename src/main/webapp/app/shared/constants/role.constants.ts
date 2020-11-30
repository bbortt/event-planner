export const ADMIN: InternalRole = {
  name: 'ADMIN',
  i18nKey: 'eventPlannerApp.role.admin',
};

export const SECRETARY: InternalRole = {
  name: 'SECRETARY',
  i18nKey: 'eventPlannerApp.role.secretary',
};

export const CONTRIBUTOR: InternalRole = {
  name: 'CONTRIBUTOR',
  i18nKey: 'eventPlannerApp.role.contributor',
};

export const VIEWER: InternalRole = {
  name: 'VIEWER',
  i18nKey: 'eventPlannerApp.role.viewer',
};

export const ROLES: InternalRole[] = [ADMIN, SECRETARY, CONTRIBUTOR, VIEWER];

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
