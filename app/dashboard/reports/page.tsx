"use client"
import { DataTable } from "@/components/data-table";
import data from "../data.json"

type Items = {
    accessorKey : string,
    header : string
}
export default function Page() {

   

    const clientColumns : Items[] = [
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