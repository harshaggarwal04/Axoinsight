'use client'

import FooterLink from '@/components/form/FooterLink';
import InputField from '@/components/form/InputField'
import { Button } from '@/components/ui/button';
import { signInWithEmail } from '@/lib/actions/auth.actions';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from "react-hook-form";
import { toast } from 'sonner';

type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur'
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInWithEmail(data)
      if(result.success)router.push('/'); 

    } catch (error) {
      console.log(error);
      toast.error("Sign in failed", {
        description: error instanceof Error ? error.message: "Failed to sign in"
      })
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">
        Log In Your Account
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <InputField
          name="email"
          label="Email"
          placeholder="Enter your email"
          type="email"
          register={register}
          error={errors.email}
          validation={{ required: "Email is required" }}
        />

        <InputField
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          register={register}
          error={errors.password}
          validation={{ required: "Password is required" }}
        />

        <Button
          type="submit"
          className="w-full h-12 bg-green-500 hover:bg-green-400 text-black font-medium rounded-lg transition"
        >
          Sign In
        </Button>

        <FooterLink text="Don't have an account" linkText='SignUp' href='/sign-up' ></FooterLink>

      </form>
    </div>
  )
}

export default SignIn