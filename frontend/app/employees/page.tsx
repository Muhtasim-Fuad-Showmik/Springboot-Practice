"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Pencil, Trash2, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import EditableCell from "@/components/editable-cell"
import { Button } from "@/components/ui/button"
import {
  fetchEmployees,
  updateEmployee,
  type Employee,
  type CreateEmployeeInput,
} from "@/lib/api/employees"
import CreateEmployeeDialog from "@/components/create-employee-dialog"
import DeleteEmployeeDialog from "@/components/delete-employee-dialog"
import { LineWobble, Ping } from "ldrs/react"
import "ldrs/react/LineWobble.css"
import "ldrs/react/Ping.css"

export default function EmployeesPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState<CreateEmployeeInput>({
    firstName: "",
    lastName: "",
    email: "",
  })
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)

  const {
    data: employees,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  })

  const updateMutation = useMutation({
    mutationFn: (params: { id: number; data: Partial<CreateEmployeeInput> }) =>
      updateEmployee(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
      setEditingId(null)
    },
  })

  const startEditing = (emp: Employee) => {
    setEditingId(emp.id)
    setEditFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
    })
  }

  const handleSave = () => {
    if (editingId === null) return
    updateMutation.mutate({ id: editingId, data: editFormData })
  }

  return (
    <div className="flex min-h-svh justify-center p-6">
      <div className="flex min-w-0 flex-col gap-4 text-sm leading-loose">
        <div className="text-center">
          <h1>Employees List</h1>

          {isPending && (
            <LineWobble
              size="80"
              stroke="5"
              bgOpacity="0.1"
              speed="1.75"
              color="var(--primary)"
            />
          )}

          {isError && (
            <p className="text-red-500">
              Error loading employees: {error?.message}
            </p>
          )}

          {!isPending && !isError && (
            <div>
              <Table className="table-fixed">
                <TableCaption>
                  List of all employees registered within the system
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8 text-right">Id</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Departments</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees?.map((emp) => {
                    const isEditing = editingId === emp.id

                    return (
                      <TableRow key={emp.id} className="group">
                        <TableCell className="text-right font-medium">
                          {emp.id}
                        </TableCell>
                        <EditableCell
                          isEditing={isEditing}
                          displayValue={emp.firstName}
                          value={editFormData.firstName}
                          onChange={(v) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              firstName: v,
                            }))
                          }
                        />
                        <EditableCell
                          isEditing={isEditing}
                          displayValue={emp.lastName}
                          value={editFormData.lastName}
                          onChange={(v) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              lastName: v,
                            }))
                          }
                        />
                        <EditableCell
                          isEditing={isEditing}
                          displayValue={emp.email}
                          value={editFormData.email}
                          onChange={(v) =>
                            setEditFormData((prev) => ({ ...prev, email: v }))
                          }
                        />
                        <TableCell className="text-left">
                          {emp.departments && emp.departments.length > 0 ? (
                            <div className="flex items-center gap-1">
                              <Badge variant="green">
                                {emp.departments[0].name}
                              </Badge>
                              {emp.departments.length > 1 && (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className="cursor-pointer"
                                    >
                                      +{emp.departments.length - 1}
                                    </Badge>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-2">
                                    <div className="flex flex-wrap gap-1">
                                      {emp.departments.map((d) => (
                                        <Badge key={d.id} variant="green">
                                          {d.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="p-0">
                          {isEditing ? (
                            <div className="flex h-full">
                              <Button
                                variant="ghost"
                                onClick={handleSave}
                                disabled={updateMutation.isPending}
                                className="flex flex-1 items-center justify-center rounded-none text-green-600"
                              >
                                {updateMutation.isPending ? (
                                  <Ping size="20" speed="2" color="white" />
                                ) : (
                                  <Check className="size-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => setEditingId(null)}
                                className="flex flex-1 items-center justify-center rounded-none text-destructive hover:bg-destructive/10"
                              >
                                <X className="size-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex h-full opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                onClick={() => startEditing(emp)}
                                className="flex flex-1 items-center justify-center rounded-none text-primary hover:bg-primary/10"
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => setDeleteTarget(emp)}
                                className="flex flex-1 items-center justify-center rounded-none text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {updateMutation.isError && (
                <p className="mt-2 text-xs text-destructive">
                  {updateMutation.error?.message}
                </p>
              )}

              <div className="mt-4 flex justify-end">
                <CreateEmployeeDialog />
              </div>
            </div>
          )}
        </div>

        {deleteTarget && (
          <DeleteEmployeeDialog
            employee={deleteTarget}
            open={!!deleteTarget}
            onOpenChange={(open) => {
              if (!open) setDeleteTarget(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
