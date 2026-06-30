import { API_BASE_URL } from "./config"

export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
}

export async function fetchEmployees(): Promise<Employee[]> {
  const response = await fetch(`${API_BASE_URL}/employees`)

  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.statusText}`)
  }

  return response.json()
}
