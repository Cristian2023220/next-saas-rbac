import { defineAbilityFor, UserSchema } from "@saas/auth";
import { Role } from "@saas/auth/src/roles";

export function getUserPermissions(userId: string, role: Role){
    const authUser = UserSchema.parse({
        id: userId,
        role: role,
    })
    const ability = defineAbilityFor(authUser)

    return ability

}