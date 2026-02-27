'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { useFormState } from '@/hooks/use-form-state';
import { signUpAction } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { signInWithGithub } from "../actions";
import { ReactNode } from "react";

export function SignUpForm(): ReactNode {
  const router = useRouter(); 

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signUpAction,
    () => {
      router.push('/auth/sign-in');
    }
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4 " />
            <AlertTitle>Sign-in failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input name="name" id="name" /> 
        </div>
        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input name="email" type="email" id="email" />
        </div>
        {errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        )}

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input name="password" type="password" id="password" />
        </div>
        {errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </p>
        )}

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="confirm_password">Confirm your password</Label>
          </div>
          <Input name="confirm_password" type="password" id="confirm_password" />
        </div>
        {errors?.confirm_password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.confirm_password[0]}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Create account'
          )}
        </Button>

        <Button className="w-full" variant="link" size="sm" asChild>
          <Link href="/auth/sign-in">Already registered? Sign-in</Link>
        </Button>
      </form> 

      <Separator />
      <form action={signInWithGithub}>
        <Button type="submit" variant="outline" className="w-full flex items-center gap-2 justify-center">
          <Image
            src="/github-icon.svg"
            className="size-4 dark:invert"
            alt="GitHub Icon"
            width={16}
            height={16}
          />
          <span>Sign up with GitHub</span>
        </Button>
      </form>
    </div>
  );
}