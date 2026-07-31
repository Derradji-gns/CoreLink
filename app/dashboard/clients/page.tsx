"use client"

import { useEffect, useState, useCallback } from "react"
import { DataTable } from "@/components/data-table"
import { ClientForm } from "./clients-form"
import { getClients, deleteClient } from "./clients"

export default function Page() {
  const [data, setData] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    try {
      const fresh = await getClients()
      setData(fresh)
    } catch (err) {
      console.error("Failed to fetch clients:", err)
    }
  }, [])

  useEffect(() => {
    fetchData() // initial load
    const id = setInterval(fetchData, 4000) // poll every 4s
    return () => clearInterval(id)
  }, [fetchData])

  const clientColumns = [
    { accessorKey: "id", header: "id" },
    { accessorKey: "name", header: "name" },
    { accessorKey: "email", header: "email" },
    { accessorKey: "status", header: "status" },
  ]

  return (
    <div className="m-6">
      <DataTable
        data={data}
        columns={clientColumns}
        buttonText="Client"
        renderAddForm={(close) => (
          <ClientForm
            onSuccess={() => {
              fetchData()
              close()
            }}
          />
        )}
        renderEditForm={(client, close) => (
          <ClientForm
            client={client}
            onSuccess={() => {
              fetchData()
              close()
            }}
          />
        )}
        getRowLabel={(client) => client.name}
        onDeleteRow={async (client) => {
          await deleteClient(client.id)
          fetchData()
        }}
      />
    </div>
  )
}