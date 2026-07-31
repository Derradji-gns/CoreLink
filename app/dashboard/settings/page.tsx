"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react"

type Status = { type: "success" | "error"; message: string } | null

export default function SettingsPage() {
  const supabase = createClient()

  const [loading, setLoading] = React.useState(true)
  const [email, setEmail] = React.useState("")
  const [fullName, setFullName] = React.useState("")
  const [avatarUrl, setAvatarUrl] = React.useState("")

  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  const [emailNotifications, setEmailNotifications] = React.useState(true)
  const [productUpdates, setProductUpdates] = React.useState(false)

  const [profileStatus, setProfileStatus] = React.useState<Status>(null)
  const [passwordStatus, setPasswordStatus] = React.useState<Status>(null)
  const [savingProfile, setSavingProfile] = React.useState(false)
  const [savingPassword, setSavingPassword] = React.useState(false)

  React.useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setEmail(user.email ?? "")
        setFullName(user.user_metadata?.full_name ?? "")
        setAvatarUrl(user.user_metadata?.avatar_url ?? "")
      }
      setLoading(false)
    }
    loadUser()
  }, [supabase])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    setProfileStatus(null)

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, avatar_url: avatarUrl },
    })

    setSavingProfile(false)
    setProfileStatus(
      error
        ? { type: "error", message: error.message }
        : { type: "success", message: "Profile updated." }
    )
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordStatus(null)

    if (newPassword.length < 8) {
      setPasswordStatus({
        type: "error",
        message: "Password must be at least 8 characters.",
      })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: "error", message: "Passwords don't match." })
      return
    }

    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSavingPassword(false)

    if (error) {
      setPasswordStatus({ type: "error", message: error.message })
    } else {
      setPasswordStatus({ type: "success", message: "Password changed." })
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : email.slice(0, 2).toUpperCase()

  if (loading) {
    return (
      <div className="m-6 text-sm text-muted-foreground">
        Loading settings…
      </div>
    )
  }

  return (
    <div className="mx-auto my-6 flex w-full max-w-2xl flex-col items-center px-4">
      <div className="mb-6 flex flex-col items-center text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, profile, and notification preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full flex flex-col items-center">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* -------------------- PROFILE -------------------- */}
        <TabsContent value="profile" className="w-full">
          <Card className="w-full">
            <form onSubmit={handleSaveProfile}>
              <CardHeader className="items-center text-center">
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  This information may be shown to other people in your
                  organization.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Avatar className="size-16">
                    <AvatarImage src={avatarUrl} alt={fullName || email} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="avatarUrl" className="text-xs text-muted-foreground">
                      Avatar URL
                    </Label>
                    <Input
                      id="avatarUrl"
                      placeholder="https://…"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-72"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-3">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} disabled />
                  <p className="text-xs text-muted-foreground mb-5">
                    Contact an admin to change your email address.
                  </p>
                </div>

                {profileStatus && (
                  <Alert variant={profileStatus.type === "error" ? "destructive" : "default"}>
                    {profileStatus.type === "error" ? (
                      <AlertCircleIcon className="h-4 w-4" />
                    ) : (
                      <CheckCircle2Icon className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {profileStatus.type === "error" ? "Couldn't save" : "Saved"}
                    </AlertTitle>
                    <AlertDescription>{profileStatus.message}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="justify-center">
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? "Saving…" : "Save changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* -------------------- ACCOUNT (password) -------------------- */}
        <TabsContent value="account" className="w-full">
          <Card className="w-full">
            <form onSubmit={handleChangePassword}>
              <CardHeader className="items-center text-center">
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Choose a new password for your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mb-5"/>
                </div>

                {passwordStatus && (
                  <Alert variant={passwordStatus.type === "error" ? "destructive" : "default"}>
                    {passwordStatus.type === "error" ? (
                      <AlertCircleIcon className="h-4 w-4" />
                    ) : (
                      <CheckCircle2Icon className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {passwordStatus.type === "error" ? "Couldn't update" : "Updated"}
                    </AlertTitle>
                    <AlertDescription>{passwordStatus.message}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="justify-center">
                <Button type="submit" disabled={savingPassword}>
                  {savingPassword ? "Updating…" : "Change password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* -------------------- NOTIFICATIONS -------------------- */}
        <TabsContent value="notifications" className="w-full">
          <Card className="w-full">
            <CardHeader className="items-center text-center">
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose what you want to be notified about.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="emailNotifications">Email notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Get emailed when a record you manage is updated.
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1 mb-5">
                  <Label htmlFor="productUpdates">Product updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Occasional emails about new features.
                  </p>
                </div>
                <Switch
                  id="productUpdates"
                  checked={productUpdates}
                  onCheckedChange={setProductUpdates}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button
                onClick={() => {
                  // TODO: persist to a `preferences` table via updatePart/addPart
                  // once notification prefs are backed by your Supabase schema.
                }}
              >
                Save preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}