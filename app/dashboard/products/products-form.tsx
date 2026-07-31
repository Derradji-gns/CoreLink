"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addProduct, updateProduct } from "./products"

type Product = {
  id: string
  name: string
  amount: number
  price: number
  available: boolean
}

export function ProductForm({
  product,
  onSuccess,
}: {
  product?: Product
  onSuccess: () => void
}) {
  const isEditing = !!product

  const [formsInfo, setFormsInfo] = React.useState<Product>({
    id: product?.id ?? "",
    name: product?.name ?? "",
    amount: product?.amount ?? 0,
    price: product?.price ?? 0,
    available: product?.available ?? true,
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const payload = {
      id: formsInfo.id,
      name: formsInfo.name,
      amount: formsInfo.amount,
      price: formsInfo.price,
      available: formsInfo.available,
    }

    try {
      if (isEditing) {
        await updateProduct(product!.id, payload)
      } else {
        await addProduct(payload)
      }
      onSuccess()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogDescription>Fill in the details, then save.</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="id">Product ID</Label>
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
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={formsInfo.amount}
            onChange={(event) =>
              setFormsInfo({ ...formsInfo, amount: Number(event.target.value) })
            }
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formsInfo.price}
            onChange={(event) =>
              setFormsInfo({ ...formsInfo, price: Number(event.target.value) })
            }
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="available"
            checked={formsInfo.available}
            onCheckedChange={(value) =>
              setFormsInfo({ ...formsInfo, available: !!value })
            }
          />
          <Label htmlFor="available">Available</Label>
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