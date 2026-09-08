

// app/page.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChartSpline } from "lucide-react"


export default function Page() {
  return (
    <div className="flex bg-navy min-h-svh flex-col items-center justify-center gap-6  p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex  text-tealBright items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ChartSpline className="size-5 text-tealBright bg-navy border-non" />
          </div>
          CoreLink ERP
        </a>
        <Link href="/dashboard" className="flex flex-col gap-2">
        <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
