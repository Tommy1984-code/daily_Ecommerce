import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  sortable?: boolean;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;

  hideSearch?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;

  clientSide?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];

  serverSide?: boolean;
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  sortAccessor?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (accessor: string, direction: "asc" | "desc") => void;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [1];
  if (currentPage > 3) pages.push("ellipsis");
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (currentPage < totalPages - 2) pages.push("ellipsis");
  if (totalPages > 1) pages.push(totalPages);
  return pages;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  hideSearch = false,
  loading = false,
  emptyMessage = "No items found.",
  searchPlaceholder = "Search...",
  onRowClick,
  clientSide,
  pageSize: defaultPageSize = 10,
  pageSizeOptions = [10, 20, 30, 50, 100],
  serverSide,
  totalCount = 0,
  currentPage: controlledPage = 1,
  onPageChange,
  onPageSizeChange,
  searchValue: controlledSearch = "",
  onSearchChange,
  sortAccessor: controlledSortAccessor = "",
  sortDirection: controlledSortDirection = "asc",
  onSortChange,
}: DataTableProps<T>) {
  const isServer = serverSide;

  const [localSearch, setLocalSearch] = useState("");
  const [localSortIndex, setLocalSortIndex] = useState<number | null>(null);
  const [localSortDir, setLocalSortDir] = useState<"asc" | "desc">("asc");
  const [localPage, setLocalPage] = useState(1);
  const [localPageSize, setLocalPageSize] = useState(defaultPageSize);

  const search = isServer ? controlledSearch : localSearch;
  const sortIdx = isServer
    ? columns.findIndex((c) => String(c.accessor) === controlledSortAccessor)
    : localSortIndex;
  const sortDir = isServer ? controlledSortDirection : localSortDir;
  const page = isServer ? controlledPage : localPage;
  const pageSize = isServer ? (defaultPageSize) : localPageSize;

  const setSearch = useCallback(
    (v: string) => (isServer ? onSearchChange?.(v) : setLocalSearch(v)),
    [isServer, onSearchChange]
  );
  const setPageFn = useCallback(
    (v: number) => (isServer ? onPageChange?.(v) : setLocalPage(v)),
    [isServer, onPageChange]
  );
  const setPageSizeFn = useCallback(
    (v: number) => {
      if (isServer) {
        onPageSizeChange?.(v);
        onPageChange?.(1);
      } else {
        setLocalPageSize(v);
        setLocalPage(1);
      }
    },
    [isServer, onPageSizeChange, onPageChange]
  );

  useEffect(() => {
    if (!isServer) setLocalPage(1);
  }, [localSearch, isServer]);

  const processedData = useMemo(() => {
    if (isServer) return data;
    let result = [...data];
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase().trim();
      result = result.filter((item) =>
        columns.some((col) => {
          const raw = item[col.accessor];
          return String(raw).toLowerCase().includes(q);
        })
      );
    }
    if (localSortIndex !== null) {
      const col = columns[localSortIndex];
      result.sort((a, b) => {
        const aVal = a[col.accessor];
        const bVal = b[col.accessor];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal < bVal) return localSortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return localSortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, localSearch, localSortIndex, localSortDir, columns, isServer]);

  const displayData = useMemo(() => {
    if (isServer) return data;
    const totalP = Math.max(1, Math.ceil(processedData.length / localPageSize));
    const safeP = Math.min(localPage, totalP);
    return processedData.slice((safeP - 1) * localPageSize, safeP * localPageSize);
  }, [isServer, data, processedData, localPage, localPageSize]);

  const totalItems = isServer ? totalCount : processedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const from = (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, totalItems);

  const handleSort = (index: number) => {
    const col = columns[index];
    if (!col.sortable) return;
    if (isServer) {
      const isSame = String(col.accessor) === controlledSortAccessor;
      const newDir = isSame && controlledSortDirection === "asc" ? "desc" : "asc";
      onSortChange?.(String(col.accessor), newDir);
      onPageChange?.(1);
    } else {
      if (localSortIndex === index) {
        setLocalSortDir((p) => (p === "asc" ? "desc" : "asc"));
      } else {
        setLocalSortIndex(index);
        setLocalSortDir("asc");
      }
      setLocalPage(1);
    }
  };

  return (
    <div className="space-y-4">
      {!hideSearch && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, i) => (
                  <TableHead
                    key={i}
                    className={cn(
                      col.sortable && "cursor-pointer select-none hover:text-foreground",
                      col.headerClassName
                    )}
                    onClick={() => col.sortable && handleSort(i)}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable &&
                        (sortIdx === i ? (
                          sortDir === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                        ))}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : displayData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                displayData.map((item) => (
                  <TableRow
                    key={keyExtractor(item)}
                    className={cn(onRowClick && "cursor-pointer")}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((col, i) => (
                      <TableCell key={i} className={col.className}>
                        {col.cell ? col.cell(item) : String(item[col.accessor] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => setPageSizeFn(Number(v))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>{from}–{to} of {totalItems}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={safePage <= 1}
            onClick={() => setPageFn(safePage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {getPageNumbers(safePage, totalPages).map((p, i) =>
            p === "ellipsis" ? (
              <span key={`e${i}`} className="px-1 text-muted-foreground">...</span>
            ) : (
              <Button
                key={p}
                variant={safePage === p ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 text-xs"
                onClick={() => setPageFn(p)}
              >
                {p}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={safePage >= totalPages}
            onClick={() => setPageFn(safePage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
