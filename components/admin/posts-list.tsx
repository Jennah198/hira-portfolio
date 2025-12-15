"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

type Post = {
  id: string
  title: string
  content: string
  image_url: string | null
  created_at: string
}

export function PostsList({ posts }: { posts: Post[] }) {
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    const supabase = createClient()
    const { error } = await supabase.from("posts").delete().eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Post deleted successfully",
      })
      router.refresh()
    }
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No posts yet. Create your first post to get started.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{post.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="icon">
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm line-clamp-2">{post.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
