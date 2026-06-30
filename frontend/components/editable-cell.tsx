"use client"

import { Input } from "@/components/ui/input"
import { TableCell } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface EditableCellProps {
  readonly isEditing: boolean
  readonly displayValue: string
  readonly value: string
  readonly onChange: (value: string) => void
}

export default function EditableCell({
  isEditing,
  displayValue,
  value,
  onChange,
}: EditableCellProps) {
  return (
    <TableCell
      className={cn(
        {
          "p-1": isEditing,
        },
        "text-left"
      )}
    >
      {isEditing ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-full text-xs"
        />
      ) : (
        displayValue
      )}
    </TableCell>
  )
}
