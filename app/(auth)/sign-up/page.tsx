'use client'

import CountrySelectField from '@/components/form/CountrySelectField'
import FooterLink from '@/components/form/FooterLink'
import InputField from '@/components/form/InputField'
import SelectField from '@/components/form/SelectField'
import { Button } from '@/components/ui/button'
import { signUpWithEmail } from '@/lib/actions/auth.actions'
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from '@/lib/constants'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Form, useForm } from 'react-hook-form'
import { toast } from 'sonner'



const SignUp = () => {

  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      country: '',
      investmentGoals: 'Growth',
      riskTolerance: 'Medium',
      preferredIndustry: 'Technology'
    },
    mode: 'onBlur'
  })
  const onSubmit = async (data: SignUpFormData) => {
    try {
        const result = await signUpWithEmail(data);
        if(result.success) router.push('/')


    } catch (error) {
      console.log(error)
      toast.error('Sign up failed', {
        description: error instanceof Error ? error.message: 'Failed to create an account'
      })
    }
  }

  

  return (
    <>
      <h1 className='form-title'>Sign Up & Personalize</h1>
      <form action="" onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

        <InputField name="fullName" label="Full Name" placeholder="John Doe" register={register} error={errors.fullName} validation={{ required: "Full Name is required", minLength: 2 }} />

        <InputField name="email" label="Email" placeholder="Enter you email" register={register} error={errors.email} validation={{ required: " Email is required", pattern: /^\w+@\w+\.\w+$/, message: "Email address is required" }} />

        <InputField type="password" name="password" label="Password" placeholder="Enter a strong password" register={register} error={errors.password} validation={{ required: "Password is required", minLength: 8 }} />

        <CountrySelectField
          name="country"
          label="Country"
          control={control}
          error={errors.country}
          required
        />

        <SelectField name="investmentGoals" label="Investment Goals" placeholder="Select Your Investment Goals" options={INVESTMENT_GOALS} control={control} error={errors.investmentGoals} required />

        <SelectField name="riskTolerance" label="Risk Tolerance" placeholder="Select Your Risk Level" options={RISK_TOLERANCE_OPTIONS} control={control} error={errors.riskTolerance} required />

        <SelectField name="preferredIndustry" label="Preferred Industry" placeholder="Select Your Preferred Industry" options={PREFERRED_INDUSTRIES} control={control} error={errors.preferredIndustry} required />



        <Button type="submit" disabled={isSubmitting} className='green-btn w-full mt-5'>
          {isSubmitting ? 'Creating Account' : 'Start Your Investment Journey'}
        </Button>

        <FooterLink text='Already have an account' linkText='Sign in' href='/sign-in'/>
      </form>
    </>
  )
}

export default SignUp