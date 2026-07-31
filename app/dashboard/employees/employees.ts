
export async function getEmployees() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch employees")
  return res.json()
}

export async function addEmployer(payload: unknown) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to create employee")
  return res.json()
}

export async function updateEmployer(id: string, payload: unknown) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to update employee")
  return res.json()
}

export async function deleteEmployer(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete employee")
  return res.json()
}