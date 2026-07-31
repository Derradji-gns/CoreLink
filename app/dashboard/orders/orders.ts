
async function getOrders() {

    const res = await fetch("http://localhost:3000/orders")

    if (!res.ok) {
    throw new Error("Failed to fetch orders")
  }

    return res.json();
}

export const orders = await getOrders();