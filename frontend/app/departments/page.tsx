"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Pencil, Trash2, Check, X, UserPlus } from "lucide-react"
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
  fetchDepartments,
  updateDepartment,
  type Department,
  type CreateDepartmentInput,
} from "@/lib/api/departments"
import CreateDepartmentDialog from "@/components/create-department-dialog"
import DeleteDepartmentDialog from "@/components/delete-department-dialog"
import AssignEmployeesDialog from "@/components/assign-employees-dialog"
import { LineWobble, Ping } from "ldrs/react"
import "ldrs/react/LineWobble.css"
import "ldrs/react/Ping.css"

export default function DepartmentsPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState<CreateDepartmentInput>({
    name: "",
    description: "",
  })
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null)
  const [assignTarget, setAssignTarget] = useState<Department | null>(null)

  const {
    data: departments,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  })

  const updateMutation = useMutation({
    mutationFn: (params: {
      id: number
      data: Partial<CreateDepartmentInput>
    }) => updateDepartment(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] })
      setEditingId(null)
    },
  })

  const startEditing = (dept: Department) => {
    setEditingId(dept.id)
    setEditFormData({
      name: dept.name,
      description: dept.description,
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
          <h1>Departments List</h1>

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
              Error loading departments: {error?.message}
            </p>
          )}

          {!isPending && !isError && (
            <div>
              <Table className="table-fixed">
                <TableCaption>
                  List of all departments registered within the system
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8 text-right">Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-20 text-center">
                      Employees
                    </TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments?.map((dept) => {
                    const isEditing = editingId === dept.id

                    return (
                      <TableRow key={dept.id} className="group">
                        <TableCell className="text-right font-medium">
                          {dept.id}
                        </TableCell>
                        <EditableCell
                          isEditing={isEditing}
                          displayValue={dept.name}
                          value={editFormData.name}
                          onChange={(v) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              name: v,
                            }))
                          }
                        />
                        <EditableCell
                          variant="description"
                          isEditing={isEditing}
                          displayValue={dept.description}
                          value={editFormData.description}
                          onChange={(v) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              description: v,
                            }))
                          }
                        />
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setAssignTarget(dept)}
                            className="gap-1"
                          >
                            <UserPlus className="size-4" />
                            <span className="text-xs">
                              {dept.employeeCount}
                            </span>
                          </Button>
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
                                onClick={() => startEditing(dept)}
                                className="flex flex-1 items-center justify-center rounded-none text-primary hover:bg-primary/10"
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => setDeleteTarget(dept)}
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
                <CreateDepartmentDialog />
              </div>
            </div>
          )}
        </div>

        {deleteTarget && (
          <DeleteDepartmentDialog
            department={deleteTarget}
            open={!!deleteTarget}
            onOpenChange={(open) => {
              if (!open) setDeleteTarget(null)
            }}
          />
        )}

        {assignTarget && (
          <AssignEmployeesDialog
            department={assignTarget}
            open={!!assignTarget}
            onOpenChange={(open) => {
              if (!open) setAssignTarget(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
