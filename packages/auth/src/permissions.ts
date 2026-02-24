import { AbilityBuilder } from "@casl/ability"
import { AppAbility } from "."
import { Role } from "./roles"
import { User } from "./models/user"


type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void

export const permissions: Record<Role,PermissionsByRole> = {
    ADMIN(user, {can, cannot}) {
        can('manage', 'all')

        cannot(['transfer_ownership', 'update'], 'Organization')
        can(['transfer_ownership', 'update'], 'Organization',
             {owner_id: {$eq: user.id}})

    },
    MEMBER(user, {can}) {
        can('get', 'User')
        can(['create', 'get'], 'Project')
        can(['update', 'delete'], 'Project', {owner_id: {$eq: user.id}})


    },
    BILLING(__, {can}) {
        can('manage', 'Billing')

    },

}
