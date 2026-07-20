"use client"
import { DataTable } from "@/components/data-table";
import data from "../data.json"

type Item = {
  accessorKey: string
  header: string
}

export default function Page() {

   
   

    const clientColumns : Item[] = [
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

                
            <DataTable data={data}
             columns={clientColumns}/>
        </div>
    )
}