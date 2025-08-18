import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin">
        <Loader2 className="h-8 w-8 text-primary" />
      </div>
    </div>
  )
}
