'use client'

import { selectOrganization } from '@/auth/actions'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { DropdownMenuItem } from './ui/dropdown-menu'
import { ComponentProps } from 'react'

interface Organization {
  id: string
  name: string | null
  slug: string
  avatarUrl: string | null
}

interface OrganizationSwitcherListProps extends ComponentProps<'div'> {
  organizations: Organization[]
}

export function OrganizationSwitcherList({ organizations }: OrganizationSwitcherListProps) {
  
  // Função acionada pelo clique
  async function handleSelectOrg(slug: string) {
    // Chama a server action que define o cookie e faz o REDIRECT
    await selectOrganization(slug)
  }

  return (
    <>
      {organizations.map((organization) => (
        <DropdownMenuItem 
          key={organization.id} 
          asChild
          // IMPORTANTE: onSelect impede o comportamento padrão e chama nossa função
          onSelect={() => handleSelectOrg(organization.slug)}
        >
          {/* Usamos uma div ou span com cursor-pointer em vez de Link para evitar conflito */}
          <div className="cursor-pointer flex items-center gap-2 w-full">
            <Avatar className="mr-2 size-4">
              {organization.avatarUrl && (
                <AvatarImage src={organization.avatarUrl} />
              )}
              <AvatarFallback />
            </Avatar>
            <span className="line-clamp-1">{organization.name}</span>
          </div>
        </DropdownMenuItem>
      ))}
    </>
  )
}