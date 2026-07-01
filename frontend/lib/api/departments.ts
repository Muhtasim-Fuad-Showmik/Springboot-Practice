import { API_BASE_URL } from "./config"

export interface Department {
  id: number
  name: string
  description: string
  employeeCount: number
}

export interface CreateDepartmentInput {
  name: string
  description: string
}

export async function fetchDepartments(): Promise<Department[]> {
  const response = await fetch(`${API_BASE_URL}/departments`)

  if (!response.ok) {
    throw new Error(`Failed to fetch departments: ${response.statusText}`)
  }

  return response.json()
}

export async function createDepartment(
  data: CreateDepartmentInput
): Promise<Department> {
  const response = await fetch(`${API_BASE_URL}/departments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to create department: ${response.statusText}`)
  }

  return response.json()
}

export async function updateDepartment(
  id: number,
  data: Partial<CreateDepartmentInput>
): Promise<Department> {
  const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to update department: ${response.statusText}`)
  }

  return response.json()
}

export async function deleteDepartment(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`Failed to delete department: ${response.statusText}`)
  }
}

export async function setDepartmentEmployees(
  departmentId: number,
  employeeIds: number[]
): Promise<Department> {
  const response = await fetch(
    `${API_BASE_URL}/departments/${departmentId}/employees`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employeeIds),
    }
  )

  if (!response.ok) {
    throw new Error(
      `Failed to set department employees: ${response.statusText}`
    )
  }

  return response.json()
}
