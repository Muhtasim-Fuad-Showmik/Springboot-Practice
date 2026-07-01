import { API_BASE_URL } from "./config"

export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  departments?: { id: number; name: string }[]
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

export async function updateEmployee(
  id: number,
  data: Partial<CreateEmployeeInput>
): Promise<Employee> {
  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to update employee: ${response.statusText}`)
  }

  return response.json()
}

export async function deleteEmployee(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`Failed to delete employee: ${response.statusText}`)
  }
}
