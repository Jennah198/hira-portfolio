'use client'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'

/** Top-right stacking toasts with 5s dismiss and swipe-to-dismiss (Radix). */
export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="right" duration={5000} label="Notifications">
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} duration={5000} {...props}>
          <div className="grid gap-1 pr-6">
            {title != null && title !== '' ? <ToastTitle>{title}</ToastTitle> : null}
            {description != null && description !== '' ? (
              <ToastDescription>{description}</ToastDescription>
            ) : null}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport
        className="fixed top-4 right-0 z-[150] flex max-h-[100dvh] w-full flex-col gap-3 p-4 sm:bottom-auto sm:flex-col md:max-w-[min(440px,calc(100vw-2rem))] lg:right-6"
      />
    </ToastProvider>
  )
}
