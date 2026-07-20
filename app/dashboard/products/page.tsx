"use client"
import { DataTable } from "@/components/data-table";
import data from "../data.json"
import { ProductForm } from "./products-form";
export default function Page() {

   

    const productColumns = [
        { accessorKey: "id", header: "id" },
  { accessorKey: "header", header: "header" },
  { accessorKey: "type", header: "type" },
  { accessorKey: "status", header: "status" },
  { accessorKey: "target", header: "target" },
  { accessorKey: "limit", header: "limit" },
  { accessorKey: "reviewer", header: "reviewer" },
    ]
    return (
        <div className=" m-6">

                
            <DataTable
                              data={data}
                              columns={productColumns}
                              buttonText="Client"
                              renderAddForm={(close) => (
                                <ProductForm onSuccess={close} />
                              )}
                              renderEditForm={(product, close) => (
                                <ProductForm product={product} onSuccess={close} />
                              )}
                              onDeleteRow={async (product) => {
                                if (!confirm(`Delete ${product.name}?`)) return
                                await deleteProduct(product.id)
                                // refetch or update your data state here
                              }}
                            />
        </div>
    )
}