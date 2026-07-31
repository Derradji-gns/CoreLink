"use client"

import { useEffect, useState, useCallback } from "react"
import { DataTable } from "@/components/data-table"
import { getEmployees, deleteEmployer } from "./employees"
import { EmployeeForm } from "./employees-form"

export default function Page() {
  const [data, setData] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    try {
      const fresh = await getEmployees()
      setData(fresh)
    } catch (err) {
      console.error("Failed to fetch employees:", err)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 4000)
    return () => clearInterval(id)
  }, [fetchData])

  const productColumns = [
    { accessorKey: "id", header: "id" },
    { accessorKey: "name", header: "name" },
    { accessorKey: "email", header: "email" },
    { accessorKey: "status", header: "status" },
  ]

  return (
    <div className="m-6">
      <DataTable
        data={data}
        columns={productColumns}
        buttonText="Employee"
        renderAddForm={(close) => (
          <EmployeeForm
            onSuccess={() => {
              fetchData()
              close()
            }}
          />
        )}
        renderEditForm={(employer, close) => (
          <EmployeeForm
            employer={employer}
            onSuccess={() => {
              fetchData()
              close()
            }}
          />
        )}
        getRowLabel={(employer) => employer.name}
        onDeleteRow={async (employer) => {
          await deleteEmployer(employer.id)
          fetchData()
        }}
      />
    </div>
  )
}