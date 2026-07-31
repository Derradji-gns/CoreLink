
export async function getClients() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch clients")
  return res.json()
}

export async function addClient(payload: unknown) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to create client")
  return res.json()
}

export async function updateClient(id: string, payload: unknown) {
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to update client")
  return res.json()
}

export async function deleteClient(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete client")
  return res.json()
}