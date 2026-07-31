"use client"
import { DataTable } from "@/components/data-table";
import data from "./payments.json"


export default function Page() {

   
   

 const paymentsColumns = [
  { accessorKey: "id", header: "id" },
  { accessorKey: "client", header: "client" },
  { accessorKey: "provider", header: "provider" },
  { accessorKey: "method", header: "method" },
  { accessorKey: "amount", header: "amount" },
  { accessorKey: "currency", header: "currency" },
  { accessorKey: "status", header: "status" },
]
    return (
        <div className="m-6 overflow-hidden">

                
            <DataTable data={data}
             columns={paymentsColumns}/>
        </div>
    )
}