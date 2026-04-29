"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Mail, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

type Registration = {
  id: string
  type: string
  full_name: string
  email: string
  phone: string | null
  university: string | null
  department: string | null
  area_of_interest: string | null
  message: string | null
  created_at: string
}

export function RegistrationsList({
  registrations,
}: {
  registrations: Registration[]
}) {
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return

    const supabase = createClient()
    const { error } = await supabase.from("registrations").delete().eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete registration",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Registration deleted successfully",
      })
      router.refresh()
    }
  }

  if (registrations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">No registrations yet.</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {registrations.map((registration) => (
        <Card key={registration.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{registration.full_name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(registration.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={() => handleDelete(registration.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${registration.email}`} className="hover:underline">
                {registration.email}
              </a>
            </div>
            {registration.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${registration.phone}`} className="hover:underline">
                  {registration.phone}
                </a>
              </div>
            )}
            {registration.university && (
              <p className="text-sm">
                <span className="font-medium">University:</span> {registration.university}
              </p>
            )}
            {registration.department && (
              <p className="text-sm">
                <span className="font-medium">Department:</span> {registration.department}
              </p>
            )}
            {registration.area_of_interest && (
              <p className="text-sm">
                <span className="font-medium">Area of Interest:</span> {registration.area_of_interest}
              </p>
            )}
            {registration.message && (
              <p className="text-sm">
                <span className="font-medium">Message:</span> {registration.message}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
