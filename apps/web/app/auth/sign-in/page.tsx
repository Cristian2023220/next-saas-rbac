import { ReactNode, Suspense } from "react";
import { SignInForm } from "./sign-in-form";
export default function SignInPage(): ReactNode {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SignInForm />
    </Suspense>
  );
}