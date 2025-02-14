export async function getStore(storeId: string) {
  const res = await fetch(`http://localhost:3000/api/store/${storeId}`)
  const data = await res.json()
  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data.store
}
