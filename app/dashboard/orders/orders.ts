
async function getOrders() {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`)

    if (!res.ok) {
    throw new Error("Failed to fetch orders")
  }

    return res.json();
}

export const orders = await getOrders();