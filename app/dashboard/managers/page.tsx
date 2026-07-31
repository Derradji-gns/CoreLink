"use client"

import { useEffect, useState, useCallback } from "react"
import { DataTable } from "@/components/data-table"
import { getManagers, deleteManager } from "./managers"
import { ManagerForm } from "./managers-form"

export default function Page() {
  const [data, setData] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    try {
      const fresh = await getManagers()
      setData(fresh)
    } catch (err) {
      console.error("Failed to fetch managers:", err)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 4000)
    return () => clearInterval(id)
  }, [fetchData])

  const managerColumns = [
    { accessorKey: "id", header: "id" },
    { accessorKey: "name", header: "name" },
    { accessorKey: "email", header: "email" },
    { accessorKey: "status", header: "status" },
  ]

  return (
    <div className="m-6">
      <DataTable
        data={data}
        columns={managerColumns}
        buttonText="Manager"
        renderAddForm={(close) => (
          <ManagerForm
            onSuccess={() => {
              fetchData()
              close()
            }}
          />
        )}
        renderEditForm={(manager, close) => (
          <ManagerForm
            manager={manager}
            onSuccess={() => {
              fetchData()
              close()
            }}
          />
        )}
        getRowLabel={(manager) => manager.name}
        onDeleteRow={async (manager) => {
          await deleteManager(manager.id)
          fetchData()
        }}
      />
    </div>
  )
}