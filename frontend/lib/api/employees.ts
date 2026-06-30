import { API_BASE_URL } from "./config"

export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface CreateEmployeeInput {
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

export async function createEmployee(
  data: CreateEmployeeInput
): Promise<Employee> {
  const response = await fetch(`${API_BASE_URL}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to create employee: ${response.statusText}`)
  }

  return response.json()
}
