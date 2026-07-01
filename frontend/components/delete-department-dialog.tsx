"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteDepartment } from "@/lib/api/departments"
import type { Department } from "@/lib/api/departments"
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

interface DeleteDepartmentDialogProps {
  readonly department: Department
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

export default function DeleteDepartmentDialog({
  department,
  open,
  onOpenChange,
}: DeleteDepartmentDialogProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => deleteDepartment(department.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] })
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {department.name}? This action
            cannot be undone.
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
