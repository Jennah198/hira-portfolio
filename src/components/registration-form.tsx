'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

const registrationSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
  additional_info: z.string().optional(),
})

type RegistrationFormProps = {
  eventType: 'graduation' | 'exhibition' | 'membership'
  buttonText?: string
}

type RegistrationValues = z.infer<typeof registrationSchema>

export function RegistrationForm({ eventType, buttonText = 'Register Now' }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema)
  })

  const onSubmit = async (data: RegistrationValues) => {
    setIsSubmitting(true)
    
    const { error } = await supabase
      .from('registrations')
      .insert([{ ...data, event_type: eventType }])

    setIsSubmitting(false)

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Registration Successful!",
        description: "We'll contact you soon with more details.",
      })
      reset()
      
      // Optional: Trigger modal or redirect
      // router.push('/thank-you')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Full Name *</Label>
        <Input id="full_name" {...register('full_name')} />
        {errors.full_name?.message != null && (
          <p className="text-sm text-red-500">{String(errors.full_name.message)}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email (Optional)</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email?.message != null && (
          <p className="text-sm text-red-500">{String(errors.email.message)}</p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" {...register('phone')} />
      </div>

      <div>
        <Label htmlFor="additional_info">Additional Information</Label>
        <Textarea id="additional_info" {...register('additional_info')} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Processing...' : buttonText}
      </Button>
    </form>
  )
}