import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateOrganization(){
    return(
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Create Organization</h1>

            <form className="space-y-4">
                   {/* {success === false && message && (
                      <Alert variant="destructive">
                        <AlertTriangle className="size-4 " />
                        <AlertTitle>Sign-in failed!</AlertTitle>
                        <AlertDescription>
                          <p>{message}</p>
                        </AlertDescription>
                      </Alert>
                    )} */}
            
                    <div className="space-y-1">
                      <Label htmlFor="name">Name</Label>
                      <Input name="name" id="name" /> 
                    </div>
                   {/*} {errors?.name && (
                      <p className="text-xs font-medium text-red-500 dark:text-red-400">
                        {errors.name[0]}
                      </p>
                    )} */}
            
                    <div className="space-y-1">
                      <Label htmlFor="email">E-mail</Label>
                      <Input name="email" type="email" id="email" />
                    </div>
                   {/*} {errors?.email && (
                      <p className="text-xs font-medium text-red-500 dark:text-red-400">
                        {errors.email[0]}
                      </p>
                    )} */}
            
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input name="password" type="password" id="password" />
                    </div>
                   {/*} {errors?.password && (
                      <p className="text-xs font-medium text-red-500 dark:text-red-400">
                        {errors.password[0]}
                      </p>
                    )} */}
            
                    <Button type="submit" className="w-full" >
                        Save Organization
                    </Button>
                  </form>
        </div>
    )
}