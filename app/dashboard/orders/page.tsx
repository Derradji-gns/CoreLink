"use client"
import { DataTable } from "@/components/data-table";
import {orders} from "./orders"
export default function Page() {

   

    const ordersColumns = [
        { accessorKey: "id", header: "id" },
  { accessorKey: "client", header: "client" },
  { accessorKey: "product", header: "product" },
  { accessorKey: "amount", header: "amount" },
  { accessorKey: "approved", header: "approved" }
    ]
    return (
        <div className=" m-6">

                
            <DataTable data={orders}
             columns={ordersColumns}/>
        </div>
    )
}