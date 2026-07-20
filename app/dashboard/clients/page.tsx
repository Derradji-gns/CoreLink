"use client"
import { DataTable } from "@/components/data-table";
import data from "../data.json"
import { ClientForm } from "./clients-form";
export default function Page() {

   

    const clientColumns = [
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
  columns={clientColumns}
  buttonText="Client"
  renderAddForm={(close) => <ClientForm onSuccess={close} />}
  renderEditForm={(client, close) => (
    <ClientForm client={client} onSuccess={close} />
  )}
  getRowLabel={(client) => client.name}
  onDeleteRow={async (client) => {
    await deleteClient(client.id)
    // refetch or update your local data state here
  }}
/>
        </div>
    )
};