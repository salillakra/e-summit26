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
import { ArrowUpDown, Eye, ChevronDown, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [eventFilter, setEventFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [submissionFilter, setSubmissionFilter] = React.useState<string>("all");

  // Get unique events and categories for filters
  const uniqueEvents = React.useMemo(() => {
    const events = new Set(registrations.map((r) => r.events.name));
    return Array.from(events).sort();
  }, [registrations]);

  const uniqueCategories = React.useMemo(() => {
    const categories = new Set(registrations.map((r) => r.events.category));
    return Array.from(categories).sort();
  }, [registrations]);

  // Filter data based on selected filters
  const filteredData = React.useMemo(() => {
    return registrations.filter((reg) => {
      const matchesEvent =
        eventFilter === "all" || reg.events.name === eventFilter;
      const matchesCategory =
        categoryFilter === "all" || reg.events.category === categoryFilter;

      let matchesSubmission = true;
      if (submissionFilter === "submitted") {
        const hasFiles =
          reg.presentation_url ||
          reg.product_photos_url ||
          reg.video_link ||
          reg.fault_lines_pdf ||
          reg.achievements;
        matchesSubmission = !!hasFiles;
      } else if (submissionFilter === "pending") {
        const hasFiles =
          reg.presentation_url ||
          reg.product_photos_url ||
          reg.video_link ||
          reg.fault_lines_pdf ||
          reg.achievements;
        matchesSubmission = !hasFiles;
      }

      return matchesEvent && matchesCategory && matchesSubmission;
    });
  }, [registrations, eventFilter, categoryFilter, submissionFilter]);

  const table = useReactTable({
    data: filteredData,
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

  const clearAllFilters = () => {
    setEventFilter("all");
    setCategoryFilter("all");
    setSubmissionFilter("all");
    table.getColumn("team_name")?.setFilterValue("");
  };

  const hasActiveFilters =
    eventFilter !== "all" ||
    categoryFilter !== "all" ||
    submissionFilter !== "all" ||
    (table.getColumn("team_name")?.getFilterValue() as string)?.length > 0;

  return (
    <div className="w-full space-y-4">
      {/* Filters Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <Input
            placeholder="Filter by team name..."
            value={
              (table.getColumn("team_name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("team_name")?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />

          {/* Event Filter */}
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {uniqueEvents.map((event) => (
                <SelectItem key={event} value={event}>
                  {event}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  <span className="capitalize">{category}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Submission Status Filter */}
          <Select value={submissionFilter} onValueChange={setSubmissionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Submissions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Submissions</SelectItem>
              <SelectItem value="submitted">Files Submitted</SelectItem>
              <SelectItem value="pending">Pending Submission</SelectItem>
            </SelectContent>
          </Select>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace(/_/g, " ")}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="h-8 px-2 lg:px-3"
            >
              Clear filters
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {eventFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Event: {eventFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setEventFilter("all")}
                />
              </Badge>
            )}
            {categoryFilter !== "all" && (
              <Badge variant="secondary" className="gap-1 capitalize">
                Category: {categoryFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setCategoryFilter("all")}
                />
              </Badge>
            )}
            {submissionFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Submission: {submissionFilter}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSubmissionFilter("all")}
                />
              </Badge>
            )}
          </div>
        )}
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
          Showing {table.getFilteredRowModel().rows.length} of{" "}
          {registrations.length} registration(s)
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
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
