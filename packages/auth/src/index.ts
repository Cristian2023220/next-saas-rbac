import { createMongoAbility, type ForcedSubject, type CreateAbility, type MongoAbility, AbilityBuilder } from '@casl/ability';

import { z } from 'zod';

import { User } from './models/user';
import { permissions } from './permissions';
import { ProjectSubject, projectSubject } from './subjects/project';
import { UserSubject, userSubject } from './subjects/user';
import { organizationSubject } from './subjects/organization';
import { inviteSubject } from './subjects/invite';
import { bilingSubject } from './subjects/bilings';

export * from './models/organization';
export * from './models/project';
export * from './models/user';
export * from './roles' 
export * from './models/user'



// type AppAbilities = UserSubject | ProjectSubject | ['manage', 'all'];

const appAbilitiesSchema = z.union([
  projectSubject,
  userSubject,
  organizationSubject,
  inviteSubject,
  bilingSubject,

  z.tuple([z.literal('manage'), z.literal('all')]),
]);

type AppAbilities = [string, string | object];

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility);

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`No permissions defined for role: ${user.role} not found`);
  }
  permissions[user.role](user, builder);

  const ability = builder.build();

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.can.bind(ability)

  return ability;
}
