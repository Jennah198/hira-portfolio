import type React from "react"

/** Admin pages sit below the fixed site navbar (72px). */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="pt-[72px]">{children}</div>
}
