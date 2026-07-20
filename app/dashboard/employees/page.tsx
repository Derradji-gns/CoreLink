"use client"
import { DataTable,  } from "@/components/data-table"

import data from "../data.json"
import { EmployeeForm } from "./employees-form";




export default function page() {

    const productColumns = [
        { accessorKey: "id", header: "id" },
  { accessorKey: "header", header: "header" },
  { accessorKey: "type", header: "type" },
  { accessorKey: "status", header: "status" },
  { accessorKey: "target", header: "target" },
  { accessorKey: "limit", header: "limit" },
  { accessorKey: "reviewer", header: "reviewer" },
    ];

    return (
   <div className=" m-6">
    <DataTable
      data={data}
      columns={productColumns}
      buttonText="Client"
      renderAddForm={(close) => (
        <EmployeeForm onSuccess={close} />
      )}
      renderEditForm={(product, close) => (
        <EmployeeForm product={product} onSuccess={close} />
      )}
      onDeleteRow={async (client) => {
        if (!confirm(`Delete ${product.name}?`)) return
        await deleteProduct(product.id)
        // refetch or update your data state here
      }}
    />
    </div>)
}
  