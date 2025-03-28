import { NextResponse } from 'next/server'
import { sleep } from '../utils'

// This API endpoint returns the current timestamp and a random number
// It also has an artificial delay to simulate a real API call
export async function GET() {
  try {
    // Simulate network delay
    await sleep(1000)

    // Get current timestamp
    const timestamp = new Date().toISOString()

    // Generate a random number to demonstrate that we're getting fresh data
    const randomValue = Math.floor(Math.random() * 1000)

    // Return the data
    return NextResponse.json(
      {
        data: {
          note: 'このデータが変わらない場合はキャッシュから取得されています',
          randomValue,
          timestamp,
        },
        message: 'Success',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        data: null,
        message: 'Error fetching timestamp',
      },
      { status: 500 },
    )
  }
}
