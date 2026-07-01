"use client"

import { MessageSquareText } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const editableCellVariants = cva("text-left", {
  variants: {
    variant: {
      default: "",
      description: "max-w-0",
    },
    isEditing: {
      true: "p-1",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "description",
      isEditing: false,
      className: "",
    },
  ],
  defaultVariants: {
    variant: "default",
  },
})

interface EditableCellProps extends VariantProps<typeof editableCellVariants> {
  readonly isEditing: boolean
  readonly displayValue: string
  readonly value: string
  readonly onChange: (value: string) => void
  readonly maxLength?: number
}

function renderCellContent(
  variant: "default" | "description" | null,
  isEditing: boolean,
  displayValue: string,
  value: string,
  onChange: (value: string) => void,
  maxLength: number
) {
  if (isEditing && variant === "description") {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className="min-h-16 w-full resize-none text-xs"
      />
    )
  }

  if (isEditing) {
    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className="h-6 w-full text-xs"
      />
    )
  }

  if (variant === "description") {
    return (
      <div className="flex items-center gap-1.5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon-xs" className="shrink-0">
              <MessageSquareText className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="start"
            className="max-w-xs text-sm"
          >
            {displayValue}
          </PopoverContent>
        </Popover>
        <span className="truncate">{displayValue}</span>
      </div>
    )
  }

  return displayValue
}

export default function EditableCell({
  variant,
  isEditing,
  displayValue,
  value,
  onChange,
  maxLength,
}: Readonly<EditableCellProps>) {
  const resolvedVariant = variant ?? "default"
  const effectiveMaxLength =
    maxLength ?? (resolvedVariant === "description" ? 255 : 100)

  return (
    <TableCell className={cn(editableCellVariants({ variant, isEditing }))}>
      {renderCellContent(
        resolvedVariant,
        isEditing,
        displayValue,
        value,
        onChange,
        effectiveMaxLength
      )}
    </TableCell>
  )
}
