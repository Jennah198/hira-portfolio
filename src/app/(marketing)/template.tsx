/** Re-mounts on every navigation inside (marketing) → gentle page-enter transition. */
export default function MarketingTemplate({ children }: { children: React.ReactNode }) {
  return <div className="enter">{children}</div>
}
