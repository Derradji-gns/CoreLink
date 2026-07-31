"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addClient, updateClient } from "./clients"

type Client = {
  id: string
  name: string
  email: string
  status: boolean
}

export function ClientForm({
  client,
  onSuccess,
}: {
  client?: Client
  onSuccess: () => void
}) {
  const isEditing = !!client

  const [formsInfo, setFormsInfo] = React.useState<Client>({
    id: client?.id ?? "",
    name: client?.name ?? "",
    email: client?.email ?? "",
    status: client?.status ?? true,
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const payload = {
      id: formsInfo.id,
      name: formsInfo.name,
      email: formsInfo.email,
      status: formsInfo.status,
    }

    try {
      if (isEditing) {
        await updateClient(client!.id, payload)
      } else {
        await addClient(payload)
      }
      onSuccess()
    } catch (err) {
      console.error(err)
      // TODO: surface an error to the user (toast, inline message, etc.)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Client" : "Add Client"}</DialogTitle>
        <DialogDescription>Fill in the details, then save.</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="id">Client ID</Label>
          <Input
            id="id"
            name="id"
            value={formsInfo.id}
            disabled={isEditing}
            onChange={(event) =>
              setFormsInfo({ ...formsInfo, id: event.target.value })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formsInfo.name}
            onChange={(event) =>
              setFormsInfo({ ...formsInfo, name: event.target.value })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formsInfo.email}
            onChange={(event) =>
              setFormsInfo({ ...formsInfo, email: event.target.value })
            }
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="status"
            checked={formsInfo.status}
            onCheckedChange={(value) =>
              setFormsInfo({ ...formsInfo, status: !!value })
            }
          />
          <Label htmlFor="status">Active</Label>
        </div>
      </div>
      <DialogFooter>
        <DialogClose render={<Button variant="outline" type="button" />}>
          Cancel
        </DialogClose>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  )
}