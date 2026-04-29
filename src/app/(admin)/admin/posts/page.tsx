import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PostsList } from "@/components/admin/posts-list"

export default async function PostsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: posts } = await supabase.from("posts").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/admin">← Back</Link>
            </Button>
            <h1 className="text-2xl font-bold">Manage Posts</h1>
          </div>
          <Button asChild>
            <Link href="/admin/posts/new">Create Post</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <PostsList posts={posts || []} />
      </main>
    </div>
  )
}
