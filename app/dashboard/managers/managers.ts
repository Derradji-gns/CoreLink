
export async function getManagers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/managers`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch managers")
  return res.json()
}

export async function addManager(payload: unknown) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/managers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to create manager")
  return res.json()
}

export async function updateManager(id: string, payload: unknown) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/managers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to update manager")
  return res.json()
}

export async function deleteManager(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/managers/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete manager")
  return res.json()
}