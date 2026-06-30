"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteEmployee } from "@/lib/api/employees"
import type { Employee } from "@/lib/api/employees"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LineWobble } from "ldrs/react"

interface DeleteEmployeeDialogProps {
  readonly employee: Employee
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

export default function DeleteEmployeeDialog({
  employee,
  open,
  onOpenChange,
}: DeleteEmployeeDialogProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deleteEmployee(employee.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {employee.firstName}{" "}
            {employee.lastName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {mutation.isError && (
          <p className="text-xs text-destructive">{mutation.error?.message}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <LineWobble
                size="80"
                stroke="5"
                bgOpacity="0.1"
                speed="1.75"
                color="white"
              />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
