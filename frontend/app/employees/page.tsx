import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function EmployeesPage() {
  const dummyData = [
    {
      id: 1,
      firstName: "David",
      lastName: "Martinez",
      email: "davidmartinez@gmail.com",
    },
    {
      id: 2,
      firstName: "Lucy",
      lastName: "Martinez",
      email: "lucymartinez@gmail.com",
    },
    {
      id: 4,
      firstName: "Adam",
      lastName: "Smasher",
      email: "adamsmasher@gmail.com",
    },
    {
      id: 5,
      firstName: "Rogue",
      lastName: "Amendiares",
      email: "rogueamendiares@gmail.com",
    },
    {
      id: 6,
      firstName: "Weak",
      lastName: "Kingsley",
      email: "weakkingsley@gmail.com",
    },
    {
      id: 7,
      firstName: "Arthur",
      lastName: "Cormac",
      email: "arthurcormac@gmail.com",
    },
    {
      id: 8,
      firstName: "Gloria",
      lastName: "Martinez",
      email: "gloriamartinez@gmail.com",
    },
    {
      id: 9,
      firstName: "Sasha",
      lastName: "Yakovleva",
      email: "sashayakovleva@gmail.com",
    },
    {
      id: 10,
      firstName: "Rebecca",
      lastName: "Carmine",
      email: "rebeccacarmine@gmail.com",
    },
    {
      id: 3,
      firstName: "Lucyna",
      lastName: "Martinez",
      email: "lucynamartinez@edgerunners.cyberpunk",
    },
  ]

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1>Employees List</h1>

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
              {dummyData.map((emp) => (
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
        </div>
      </div>
    </div>
  )
}
