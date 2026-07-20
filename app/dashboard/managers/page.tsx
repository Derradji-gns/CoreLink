"use client"
import { DataTable } from "@/components/data-table";

import data from "../data.json"
import { ManagerForm } from "./managers-form";
export default function Page() {

        const managerColumns = [
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
                  columns={managerColumns}
                  buttonText="Client"
                  renderAddForm={(close) => (
                    <ManagerForm onSuccess={close} />
                  )}
                  renderEditForm={(manager, close) => (
                    <ManagerForm manager={manager} onSuccess={close} />
                  )}
                  onDeleteRow={async (manager) => {
                    if (!confirm(`Delete ${manager.name}?`)) return
                    await deleteProduct(manager.id)
                    // refetch or update your data state here
                  }}
                />
        </div>
    )
}