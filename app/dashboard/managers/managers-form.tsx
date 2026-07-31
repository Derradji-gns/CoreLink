"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addManager, updateManager } from "./managers"

type Manager = {
  id: string
  name: string
  email: string
  status: boolean
}

export function ManagerForm({
  manager,
  onSuccess,
}: {
  manager?: Manager
  onSuccess: () => void
}) {
  const isEditing = !!manager

  const [formsInfo, setFormsInfo] = React.useState<Manager>({
    id: manager?.id ?? "",
    name: manager?.name ?? "",
    email: manager?.email ?? "",
    status: manager?.status ?? true,
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
        await updateManager(manager!.id, payload)
      } else {
        await addManager(payload)
      }
      onSuccess()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Manager" : "Add Manager"}</DialogTitle>
        <DialogDescription>Fill in the details, then save.</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="id">Manager ID</Label>
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