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
import { ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Registration = {
  id: string;
  registered_at: string;
  team_id: string;
  presentation_url?: string | null;
  product_photos_url?: string | null;
  achievements?: string | null;
  video_link?: string | null;
  fault_lines_pdf?: string | null;
  events: {
    id: string;
    name: string;
    slug: string;
    category: string;
  };
  teams: {
    id: string;
    name: string;
    slug: string;
  };
};

interface RegistrationsDataTableProps {
  registrations: Registration[];
}

const columns: ColumnDef<Registration>[] = [
  {
    accessorKey: "teams.name",
    id: "team_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Team Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const team = row.original.teams;
      return (
        <div>
          <div className="font-medium">{team.name}</div>
          <div className="text-sm text-muted-foreground">@{team.slug}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "events.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Event Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const event = row.original.events;
      return <div className="font-medium">{event.name}</div>;
    },
  },
  {
    accessorKey: "events.category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.events.category;
      return (
        <Badge variant="outline" className="capitalize">
          {category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "registered_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Registered At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("registered_at"));
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <div className="text-muted-foreground">{formattedDate}</div>;
    },
  },
  {
    id: "submission_files",
    header: "Submission Files",
    cell: ({ row }) => {
      const reg = row.original;
      const eventSlug = reg.events.slug;
      const isBPlan = eventSlug === "b-plan";
      const isInvestorSummit = eventSlug === "investors-summit";
      const isFaultLines = eventSlug === "fault-lines";

      const files = [];
      if (isBPlan && reg.presentation_url)
        files.push({
          icon: "📄",
          label: "Presentation",
          url: reg.presentation_url,
        });
      if (isInvestorSummit) {
        if (reg.presentation_url)
          files.push({
            icon: "📄",
            label: "Presentation",
            url: reg.presentation_url,
          });
        if (reg.product_photos_url)
          files.push({
            icon: "📷",
            label: "Photos",
            url: reg.product_photos_url,
          });
        if (reg.video_link)
          files.push({ icon: "🎥", label: "Video", url: reg.video_link });
      }
      if (isFaultLines && reg.fault_lines_pdf)
        files.push({ icon: "📄", label: "PDF", url: reg.fault_lines_pdf });

      if (!isBPlan && !isInvestorSummit && !isFaultLines) {
        return <span className="text-xs text-muted-foreground">N/A</span>;
      }

      if (files.length === 0 && !reg.achievements) {
        return (
          <span className="text-xs text-muted-foreground italic">
            No files submitted
          </span>
        );
      }

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-7">
              {files.length > 0 && (
                <span className="text-xs">
                  {files.map((f) => f.icon).join(" ")} ({files.length})
                </span>
              )}
              {isInvestorSummit && reg.achievements && files.length === 0 && (
                <span className="text-xs">View Details</span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submission Files</DialogTitle>
              <DialogDescription>
                Team: {reg.teams.name} • Event: {reg.events.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {files.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Uploaded Files:</h4>
                  <div className="space-y-2">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                      >
                        <span className="text-sm flex items-center gap-2">
                          {file.icon} {file.label}
                        </span>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="secondary">
                            Open Link
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {isInvestorSummit && reg.achievements && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Achievements:</h4>
                  <div className="p-3 border rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {reg.achievements}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const registration = row.original;
      const teamId = registration.team_id;
      const eventId = registration.events.id;

      return (
        <div className="flex gap-2">
          <Link href={`/admin/dashboard/registrations/team/${teamId}`}>
            <Button className="cursor-pointer" variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View Team
            </Button>
          </Link>
          <Link href={`/admin/dashboard/events/${eventId}`}>
            <Button className="cursor-pointer" variant="secondary" size="sm">
              View Event
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export function RegistrationsDataTable({
  registrations,
}: RegistrationsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: registrations,
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

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter by team name..."
          value={
            (table.getColumn("team_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("team_name")?.setFilterValue(event.target.value)
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
                            header.getContext(),
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
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No registrations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} registration(s) total
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
