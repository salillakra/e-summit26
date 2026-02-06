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
import { ArrowUpDown, Medal, Trash2, Save } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type TeamRegistration = {
  id: string;
  registered_at: string;
  presentation_url?: string | null;
  product_photos_url?: string | null;
  achievements?: string | null;
  video_link?: string | null;
  fault_lines_pdf?: string | null;
  teams: {
    id: string;
    name: string;
    slug: string;
    team_leader_id: string;
  };
  event_results?: Array<{
    rank: number;
    marks: number;
    declared_at: string;
  }>;
};

interface TeamResultsTableMeta {
  editingResults: Record<string, { rank: number | null; marks: number | null }>;
  setEditingResults: React.Dispatch<
    React.SetStateAction<
      Record<string, { rank: number | null; marks: number | null }>
    >
  >;
  handleSaveResult: (teamId: string, teamName: string) => Promise<void>;
  handleDeleteResult: (teamId: string, teamName: string) => Promise<void>;
  maxScore: number;
}

interface TeamResultsTableProps {
  eventId: string;
  eventName: string;
  eventSlug: string;
  registrations: TeamRegistration[];
  maxScore: number;
}

export function TeamResultsTable({
  eventId,
  eventName,
  eventSlug,
  registrations,
  maxScore,
}: TeamResultsTableProps) {
  const { toast } = useToast();
  const [editingResults, setEditingResults] = useState<
    Record<string, { rank: number | null; marks: number | null }>
  >({});

  const handleSaveResult = async (teamId: string, teamName: string) => {
    const result = editingResults[teamId];

    if (!result || result.rank === null || result.marks === null) {
      toast({
        title: "Validation Error",
        description: "Please provide both rank and marks",
        variant: "destructive",
      });
      return;
    }

    if (result.marks < 0 || result.marks > maxScore) {
      toast({
        title: "Validation Error",
        description: `Marks must be between 0 and ${maxScore}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/admin/event-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          teamId,
          rank: result.rank,
          marks: result.marks,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save result");
      }

      toast({
        title: "Success",
        description: `Result saved for ${teamName}`,
      });

      // Clear editing state
      const newEditingResults = { ...editingResults };
      delete newEditingResults[teamId];
      setEditingResults(newEditingResults);

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save result. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResult = async (teamId: string, teamName: string) => {
    try {
      const response = await fetch("/api/admin/event-results", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, teamId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete result");
      }

      toast({
        title: "Success",
        description: `Result deleted for ${teamName}`,
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete result. Please try again.",
        variant: "destructive",
      });
    }
  };

  const columns = React.useMemo<ColumnDef<TeamRegistration>[]>(
    () => [
      {
        accessorKey: "teams.name",
        id: "team_name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Team Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const team = row.original.teams;
          return <div className="font-medium">{team.name}</div>;
        },
      },
      {
        accessorKey: "registered_at",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Registered At
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = new Date(row.getValue("registered_at"));
          return <div>{date.toLocaleDateString()}</div>;
        },
      },
      {
        id: "submission_files",
        header: "Submission Files",
        cell: ({ row }) => {
          const reg = row.original;
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
                No files
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
                  {isInvestorSummit &&
                    reg.achievements &&
                    files.length === 0 && (
                      <span className="text-xs">View Details</span>
                    )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Submission Files</DialogTitle>
                  <DialogDescription>Team: {reg.teams.name}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {files.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3">
                        Uploaded Files:
                      </h4>
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
                      <h4 className="text-sm font-medium mb-2">
                        Achievements:
                      </h4>
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
        id: "rank",
        header: "Rank",
        cell: ({ row, table }) => {
          const meta = table.options.meta as TeamResultsTableMeta;
          const { editingResults, setEditingResults } = meta;
          const teamId = row.original.teams.id;
          const existingResult = row.original.event_results?.[0];
          const editingResult = editingResults[teamId];

          if (existingResult && !editingResult) {
            const rankConfig =
              existingResult.rank === 1
                ? {
                    bg: "bg-yellow-500/10",
                    border: "border-yellow-500/30",
                    text: "text-yellow-500",
                    emoji: "🥇",
                  }
                : existingResult.rank === 2
                  ? {
                      bg: "bg-gray-400/10",
                      border: "border-gray-400/30",
                      text: "text-gray-400",
                      emoji: "🥈",
                    }
                  : {
                      bg: "bg-amber-600/10",
                      border: "border-amber-600/30",
                      text: "text-amber-600",
                      emoji: "🥉",
                    };
            return (
              <Badge
                variant="outline"
                className={`${rankConfig.bg} ${rankConfig.border} ${rankConfig.text} font-semibold`}
              >
                <span className="mr-1.5">{rankConfig.emoji}</span>
                Rank {existingResult.rank}
              </Badge>
            );
          }

          return (
            <Select
              value={editingResult?.rank?.toString() || ""}
              onValueChange={(value) => {
                setEditingResults({
                  ...editingResults,
                  [teamId]: {
                    ...editingResults[teamId],
                    rank: parseInt(value),
                    marks: editingResults[teamId]?.marks || null,
                  },
                });
              }}
            >
              <SelectTrigger className="w-30">
                <SelectValue placeholder="Select rank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">🥇 Rank 1</SelectItem>
                <SelectItem value="2">🥈 Rank 2</SelectItem>
                <SelectItem value="3">🥉 Rank 3</SelectItem>
              </SelectContent>
            </Select>
          );
        },
      },
      {
        id: "marks",
        header: "Marks",
        cell: ({ row, table }) => {
          const meta = table.options.meta as TeamResultsTableMeta;
          const { editingResults, setEditingResults, maxScore } = meta;
          const teamId = row.original.teams.id;
          const existingResult = row.original.event_results?.[0];
          const editingResult = editingResults[teamId];

          if (existingResult && !editingResult) {
            return (
              <Badge
                variant="secondary"
                className="font-semibold bg-green-500/10 text-green-500 border-green-500/30"
              >
                {existingResult.marks} / {maxScore}
              </Badge>
            );
          }

          return (
            <Input
              type="number"
              min={0}
              max={maxScore}
              placeholder="Enter marks"
              className="w-30"
              value={editingResult?.marks?.toString() || ""}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? null : parseInt(e.target.value);
                setEditingResults({
                  ...editingResults,
                  [teamId]: {
                    ...editingResults[teamId],
                    rank: editingResults[teamId]?.rank || null,
                    marks: value,
                  },
                });
              }}
            />
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => {
          const meta = table.options.meta as TeamResultsTableMeta;
          const {
            editingResults,
            setEditingResults,
            handleSaveResult,
            handleDeleteResult,
          } = meta;
          const team = row.original.teams;
          const existingResult = row.original.event_results?.[0];
          const editingResult = editingResults[team.id];

          if (existingResult && !editingResult) {
            return (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingResults({
                      ...editingResults,
                      [team.id]: {
                        rank: existingResult.rank,
                        marks: existingResult.marks,
                      },
                    });
                  }}
                >
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the result for team{" "}
                        <span className="font-medium text-foreground">
                          {team.name}
                        </span>
                        . This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteResult(team.id, team.name)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          }

          return (
            <Button
              size="sm"
              onClick={() => handleSaveResult(team.id, team.name)}
              disabled={
                !editingResult ||
                editingResult.rank === null ||
                editingResult.marks === null
              }
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          );
        },
      },
    ],
    [],
  );

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
    meta: {
      editingResults,
      setEditingResults,
      handleSaveResult,
      handleDeleteResult,
      maxScore,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter teams..."
          value={
            (table.getColumn("team_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("team_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-lg border border-white/10 overflow-hidden bg-white/5">
        <Table>
          <TableHeader className="bg-white/5">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-white/10 hover:bg-transparent"
              >
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
                  className="border-white/10 hover:bg-white/5 transition-colors"
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
                  No teams registered yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} team(s) registered
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
