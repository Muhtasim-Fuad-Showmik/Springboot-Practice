"use client"

import { useState, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Minus, Search } from "lucide-react"
import { setDepartmentEmployees } from "@/lib/api/departments"
import { fetchEmployees, type Employee } from "@/lib/api/employees"
import type { Department } from "@/lib/api/departments"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LineWobble } from "ldrs/react"

interface AssignEmployeesDialogProps {
  readonly department: Department
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

export default function AssignEmployeesDialog({
  department,
  open,
  onOpenChange,
}: Readonly<AssignEmployeesDialogProps>) {
  const queryClient = useQueryClient()
  const [leftSearch, setLeftSearch] = useState("")
  const [rightSearch, setRightSearch] = useState("")
  const [assignedIds, setAssignedIds] = useState<Set<number>>(new Set())
  const [animatingOut, setAnimatingOut] = useState<Set<number>>(new Set())
  const [animatingIn, setAnimatingIn] = useState<Set<number>>(new Set())
  const [prevDeptId, setPrevDeptId] = useState<number | null>(null)

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  })

  // Reset state when department changes (adjusting state during render)
  if (open && department.id !== prevDeptId && employees) {
    setPrevDeptId(department.id)
    const initiallyAssigned = employees
      .filter((emp) => emp.departments?.some((d) => d.id === department.id))
      .map((emp) => emp.id)
    setAssignedIds(new Set(initiallyAssigned))
    setLeftSearch("")
    setRightSearch("")
    setAnimatingOut(new Set())
    setAnimatingIn(new Set())
  }

  const unassigned = useMemo(
    () =>
      (employees ?? []).filter(
        (emp) =>
          !assignedIds.has(emp.id) &&
          !animatingOut.has(emp.id) &&
          `${emp.firstName} ${emp.lastName} ${emp.email}`
            .toLowerCase()
            .includes(leftSearch.toLowerCase())
      ),
    [employees, assignedIds, animatingOut, leftSearch]
  )

  const assigned = useMemo(
    () =>
      (employees ?? []).filter(
        (emp) =>
          (assignedIds.has(emp.id) || animatingIn.has(emp.id)) &&
          !animatingOut.has(emp.id) &&
          `${emp.firstName} ${emp.lastName} ${emp.email}`
            .toLowerCase()
            .includes(rightSearch.toLowerCase())
      ),
    [employees, assignedIds, animatingIn, animatingOut, rightSearch]
  )

  const addToSet = (
    setter: React.Dispatch<React.SetStateAction<Set<number>>>,
    id: number
  ) => setter((prev) => new Set(prev).add(id))

  const removeFromSet = (
    setter: React.Dispatch<React.SetStateAction<Set<number>>>,
    id: number
  ) =>
    setter((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })

  const handleAssign = (emp: Employee) => {
    addToSet(setAnimatingOut, emp.id)
    setTimeout(() => {
      removeFromSet(setAnimatingOut, emp.id)
      addToSet(setAnimatingIn, emp.id)
      addToSet(setAssignedIds, emp.id)
      setTimeout(() => removeFromSet(setAnimatingIn, emp.id), 300)
    }, 300)
  }

  const handleUnassign = (emp: Employee) => {
    addToSet(setAnimatingOut, emp.id)
    setTimeout(() => {
      removeFromSet(setAnimatingOut, emp.id)
      removeFromSet(setAssignedIds, emp.id)
    }, 300)
  }

  const mutation = useMutation({
    mutationFn: (ids: number[]) => setDepartmentEmployees(department.id, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] })
      queryClient.invalidateQueries({ queryKey: ["employees"] })
      onOpenChange(false)
    },
  })

  const handleSave = () => {
    mutation.mutate(Array.from(assignedIds))
  }

  const renderEmployeeItem = (
    emp: Employee,
    isAnimatingOut: boolean,
    isAnimatingIn: boolean,
    actionIcon: "plus" | "minus",
    onAction: () => void
  ) => (
    <div
      key={emp.id}
      className={cn(
        "flex items-center justify-between rounded-lg border px-3 py-2 transition-all duration-300",
        {
          "translate-x-4 opacity-0": isAnimatingOut,
          "-translate-x-4 opacity-0": !isAnimatingOut && isAnimatingIn,
          "translate-x-0 opacity-100": !isAnimatingOut && !isAnimatingIn,
        }
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {emp.firstName} {emp.lastName}
        </p>
        <p className="truncate text-xs text-muted-foreground">{emp.email}</p>
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onAction}
        className={`ml-2 shrink-0 rounded-full ${
          actionIcon === "plus"
            ? "text-green-600 hover:bg-green-600/10"
            : "text-destructive hover:bg-destructive/10"
        }`}
      >
        {actionIcon === "plus" ? (
          <Plus className="size-4" />
        ) : (
          <Minus className="size-4" />
        )}
      </Button>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Employees — {department.name}</DialogTitle>
          <DialogDescription>
            Assign or remove employees from this department.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Unassigned employees (left) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Search className="size-4 text-muted-foreground" />
              <Input
                placeholder="Search unassigned..."
                value={leftSearch}
                onChange={(e) => setLeftSearch(e.target.value)}
                className="h-7 text-xs"
              />
            </div>
            <div className="flex max-h-64 flex-col gap-1.5 overflow-y-auto">
              {unassigned.length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No unassigned employees
                </p>
              )}
              {unassigned.map((emp) =>
                renderEmployeeItem(
                  emp,
                  animatingOut.has(emp.id) && !assignedIds.has(emp.id),
                  false,
                  "plus",
                  () => handleAssign(emp)
                )
              )}
            </div>
          </div>

          {/* Assigned employees (right) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Search className="size-4 text-muted-foreground" />
              <Input
                placeholder="Search assigned..."
                value={rightSearch}
                onChange={(e) => setRightSearch(e.target.value)}
                className="h-7 text-xs"
              />
            </div>
            <div className="flex max-h-64 flex-col gap-1.5 overflow-y-auto">
              {assigned.length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No assigned employees
                </p>
              )}
              {assigned.map((emp) =>
                renderEmployeeItem(
                  emp,
                  animatingOut.has(emp.id) && assignedIds.has(emp.id),
                  animatingIn.has(emp.id),
                  "minus",
                  () => handleUnassign(emp)
                )
              )}
            </div>
          </div>
        </div>

        {mutation.isError && (
          <p className="text-xs text-destructive">{mutation.error?.message}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={mutation.isPending} onClick={handleSave}>
            {mutation.isPending ? (
              <LineWobble
                size="80"
                stroke="5"
                bgOpacity="0.1"
                speed="1.75"
                color="white"
              />
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
