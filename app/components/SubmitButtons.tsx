
"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { useFormStatus } from 'react-dom'
import {LoaderCircle} from 'lucide-react'

interface SubmitButtonsProps{
  text: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined
}

export const SubmitButtons = ({text, variant}: SubmitButtonsProps) => {
  const {pending} = useFormStatus()
    return (
    <>
       <Button className='w-full' type='submit' disabled={pending} variant={variant}>
        {text}
        {pending && (
            <LoaderCircle className='animate-spin'/> 
        )}
       </Button>
    </>
  )
}
