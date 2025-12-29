"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type User = {
  id: string;
  roll_no: string;
  phone: string;
  branch: string;
  whatsapp_no: string;
  onboarding_completed: boolean;
  created_at: string;
  role: string;
};

interface UsersDataTableProps {
  users: User[];
}

const createColumns = (): ColumnDef<User>[] => [
  {
    accessorKey: "roll_no" as const,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Roll No
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original.roll_no;
      return <div className="font-medium">{value || "N/A"}</div>;
    },
  },
  {
    accessorKey: "branch" as const,
    header: "Branch",
    cell: ({ row }) => {
      const value = row.original.branch;
      return (
        <Badge variant="outline" className="capitalize">
          {value || "N/A"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "phone" as const,
    header: "Phone",
    cell: ({ row }) => {
      const value = row.original.phone;
      return <div>{value || "N/A"}</div>;
    },
  },
  {
    accessorKey: "whatsapp_no" as const,
    header: "WhatsApp",
    cell: ({ row }) => {
      const value = row.original.phone;
      return <div>{value || "N/A"}</div>;
    },
  },
  {
    accessorKey: "onboarding_completed" as const,
    header: "Onboarded",
    cell: ({ row }) => {
      const completed = row.original.onboarding_completed || false;
      return completed ? (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Yes
        </Badge>
      ) : (
        <Badge variant="secondary">
          <XCircle className="mr-1 h-3 w-3" />
          No
        </Badge>
      );
    },
  },
  {
    id: "role",
    // No need for accessorFn since we're accessing directly in the cell renderer
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role || "user";
      const roleColors: Record<string, string> = {
        admin: "bg-red-500 text-white",
        moderator: "bg-blue-500 text-white",
        user: "bg-gray-500 text-white",
      };
      return (
        <Badge className={roleColors[role] || "bg-gray-500"}>{role}</Badge>
      );
    },
  },
  {
    accessorKey: "created_at" as const,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Registered
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.original.created_at;
      if (!dateValue) return <div>N/A</div>;
      const date = new Date(dateValue);
      return (
        <div>
          {isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString()}
        </div>
      );
    },
  },
];

export function UsersDataTable({ users }: UsersDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns = React.useMemo(() => createColumns(), []);

  // Ensure users is always an array
  const tableData = React.useMemo(() => {
    if (!users) {
      console.log("No users data provided");
      return [];
    }
    console.log("Table data:", users);
    return users;
  }, [users]);

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  if (!users || users.length === 0) {
    return <div>No users found</div>;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter by roll number..."
          value={(table.getColumn("roll_no")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("roll_no")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={createColumns().length}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} user(s) total
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
