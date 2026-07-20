

// app/page.tsx
import { auth } from "@/auth"
import LoginPage from "./login/page"


export default async function Page() {
  const session = await auth()

  if (!session) return <LoginPage/>

  return (
    <div>
      <p>Signed in as {session.user?.email}</p>
      
    </div>
  )
}
