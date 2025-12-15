import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RegistrationsList } from "@/components/admin/registrations-list"

const VALID_TYPES = ["membership", "graduation", "exhibition"] as const
type RegistrationType = (typeof VALID_TYPES)[number]

export default async function RegistrationsPage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params

  if (!VALID_TYPES.includes(type as RegistrationType)) {
    notFound()
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: registrations } = await supabase
    .from("registrations")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false })

  const titles: Record<RegistrationType, string> = {
    membership: "Membership Registrations",
    graduation: "Graduation Registrations",
    exhibition: "Exhibition Registrations",
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/admin">← Back</Link>
          </Button>
          <h1 className="text-2xl font-bold">{titles[type as RegistrationType]}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <RegistrationsList registrations={registrations || []} />
      </main>
    </div>
  )
}
