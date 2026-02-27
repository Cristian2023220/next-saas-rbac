import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import Image from "next/image"
import { SignUpForm } from "./sign-up-form";
import { ReactNode } from "react";


export default function SignInPage(): ReactNode {
  return (
    <SignUpForm/>
  );
}