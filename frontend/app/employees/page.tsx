"use client"

import { useQuery } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchEmployees } from "@/lib/api/employees"
import CreateEmployeeDialog from "@/components/create-employee-dialog"
import { LineWobble } from "ldrs/react"
import "ldrs/react/LineWobble.css"

export default function EmployeesPage() {
  const {
    data: employees,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  })

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
              <Table>
                <TableCaption>
                  List of all employees registered within the system
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">Id</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees?.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="text-right font-medium">
                        {emp.id}
                      </TableCell>
                      <TableCell>{emp.firstName}</TableCell>
                      <TableCell>{emp.lastName}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <CreateEmployeeDialog />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
