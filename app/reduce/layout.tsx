import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reduce | Response Advantage",
  description: "Dialectic reduction engine",
}

export default function ReduceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="ml-0">{children}</div>
}
