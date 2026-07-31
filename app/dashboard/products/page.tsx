"use client"

import { useEffect, useState, useCallback } from "react"
import { DataTable } from "@/components/data-table"
import { getProducts, deleteProduct } from "./products"
import { ProductForm } from "./products-form"

export default function Page() {
  const [data, setData] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    try {
      const fresh = await getProducts()
      setData(fresh)
    } catch (err) {
      console.error("Failed to fetch products:", err)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 4000)
    return () => clearInterval(id)
  }, [fetchData])

  const productColumns = [
    { accessorKey: "id", header: "id" },
    { accessorKey: "name", header: "name" },
    { accessorKey: "amount", header: "amount" },
    { accessorKey: "price", header: "price" },
    { accessorKey: "available", header: "available" },
  ]

  return (
    <div className="m-6">
      <DataTable
        data={data}
        columns={productColumns}
        buttonText="Product"
        renderAddForm={(close) => (
          <ProductForm
            onSuccess={() => {
              fetchData()
              close()
            }}
          />
        )}
        renderEditForm={(product, close) => (
          <ProductForm
            product={product}
            onSuccess={() => {
              fetchData()
              close()
            }}
          />
        )}
        getRowLabel={(product) => product.name}
        onDeleteRow={async (product) => {
          await deleteProduct(product.id)
          fetchData()
        }}
      />
    </div>
  )
}