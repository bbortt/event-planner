import { Pipe, PipeTransform } from '@angular/core';
import { ROLES } from 'app/shared/constants/role.constants';

/**
 * Resolves a role by the provided `roleName` and returns its i18nKey.
 */
@Pipe({ name: 'i18nRole' })
export class I18nRolePipe implements PipeTransform {
  transform(roleName: string): string {
    const resolvedRole = ROLES.find(role => role.name === roleName);
    if (!resolvedRole) {
      throw new Error(`Role with name ${roleName} not found`);
    }
    return resolvedRole.i18nKey;
  }
}
