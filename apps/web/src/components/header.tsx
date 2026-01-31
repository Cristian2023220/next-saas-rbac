import logoIcon from "@/assets/logo-icon.svg";
import { ProfileButton } from "./profile-button";
import { Slash } from 'lucide-react'
import { OrganizationSwitcher } from "./organization-switcher";
import { ability } from "@/auth/auth";
import { ProjectSwitcher } from "./project-switcher"; 
import { Separator } from "./ui/separator";
import { ThemeSwitcher } from "./theme/theme-switcher";

export async function Header() {
  const permissions = await ability()

  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between border-b pb-2 marg">
      <div className="flex items-center gap-3">
        <img
          src={logoIcon.src} 
          alt="logo"
          className="h-6 w-6 dark:invert"
        />
        
        <Slash className="size-3 -rotate-[24deg] text-border text-muted-foreground/50"/>
        
        <OrganizationSwitcher/>

        {permissions?.can('get', 'Project') && (
           <>
             <Slash className="size-3 -rotate-[24deg] text-border text-muted-foreground/50"/>
             <ProjectSwitcher /> 
           </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher/>
        <Separator orientation="vertical" className="h-5"/>
        <ProfileButton />
      </div>
    </div>
  );
}