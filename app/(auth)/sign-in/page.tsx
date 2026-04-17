'use client'

import FooterLink from '@/components/form/FooterLink';
import InputField from '@/components/form/InputField'
import { Button } from '@/components/ui/button';
import React from 'react'
import { useForm } from "react-hook-form";

type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
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
      console.log(data);
    } catch (error) {
      console.log(error);
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