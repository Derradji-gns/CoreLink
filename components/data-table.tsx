"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  GripVerticalIcon,
  Columns3Icon,
  ChevronDownIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  PlusIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react"

/* -------------------------------------------------------------------------- */
/*  Reusable column helpers — mix these into any columns array               */
/* -------------------------------------------------------------------------- */

function DragHandle({ id }: { id: UniqueIdentifier }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

/** Adds a drag handle column. Requires each row to have a unique `id`. */
export function createDragColumn<
  TData extends { id: UniqueIdentifier },
>(): ColumnDef<TData> {
  return {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  }
}

/** Adds a checkbox column for row selection (select-all in the header). */
export function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

/**
 * Adds a trailing "..." actions column with Edit / Delete options.
 * This is appended automatically by DataTable when `renderEditForm` and/or
 * `onDeleteRow` are provided — you normally don't need to call this yourself.
 * Note: `onDelete` here just opens the confirmation dialog; the actual
 * `onDeleteRow` callback only fires once the user confirms.
 */
function createActionsColumn<TData>({
  onEdit,
  onDelete,
}: {
  onEdit?: (row: TData) => void
  onDelete?: (row: TData) => void
}): ColumnDef<TData> {
  return {
    id: "actions",
    header: () => null,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground data-[state=open]:bg-muted"
              />
            }
          >
            <MoreVerticalIcon />
            <span className="sr-only">Open row menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <PencilIcon data-icon="inline-start" />
                Edit
              </DropdownMenuItem>
            )}
            {onEdit && onDelete && <DropdownMenuSeparator />}
            {onDelete && (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(row.original)}
              >
                <TrashIcon data-icon="inline-start" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

/** Whether the cell at `index` should render a right border. We skip the
 *  border on the cell immediately before the "actions" (···) column so
 *  that column doesn't visually read as its own bordered field. */
function shouldShowRightBorder<TData>(
  index: number,
  cells: { column: { id: string } }[]
) {
  if (index >= cells.length - 1) return false
  if (cells[index + 1].column.id === "actions") return false
  return true
}

function DraggableRow<TData extends { id: UniqueIdentifier }>({
  row,
}: {
  row: Row<TData>
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })
  const cells = row.getVisibleCells()
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {cells.map((cell, index) => (
        <TableCell
          key={cell.id}
          className={
            shouldShowRightBorder(index, cells) ? "border-r" : undefined
          }
        >
          {cell.column.id === "id" ? (
            <span
              className="font-mono text-xs text-muted-foreground truncate block max-w-[90px]"
              title={String(cell.getValue() ?? "")}
            >
              {String(cell.getValue() ?? "")}
            </span>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}

function PlainRow<TData>({ row }: { row: Row<TData> }) {
  const cells = row.getVisibleCells()
  return (
    <TableRow data-state={row.getIsSelected() && "selected"}>
      {cells.map((cell, index) => (
        <TableCell
          key={cell.id}
          className={
            shouldShowRightBorder(index, cells) ? "border-r" : undefined
          }
        >
          {cell.column.id === "id" ? (
            <span
              className="font-mono text-xs text-muted-foreground truncate block max-w-[90px]"
              title={String(cell.getValue() ?? "")}
            >
              {String(cell.getValue() ?? "")}
            </span>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}

/* -------------------------------------------------------------------------- */
/*  The reusable DataTable                                                   */
/* -------------------------------------------------------------------------- */

export interface DataTableProps<TData extends { id: UniqueIdentifier }> {
  /** Row data. */
  data: TData[]
  /** Column definitions — build these with tanstack's ColumnDef, optionally
   *  mixing in createDragColumn() / createSelectColumn(). Do NOT include an
   *  actions column yourself — pass renderEditForm/onDeleteRow instead and
   *  DataTable will append the "..." menu column for you. */
  columns: ColumnDef<TData>[]
  /** Label used on the Add button, e.g. "Client" -> renders "Add Client". */
  buttonText?: string
  /**
   * Renders the form shown inside the Add modal. Receives a `close` callback —
   * call it from your form's onSuccess/onSubmit to close the dialog.
   * Each page defines its own form component and passes it here, e.g.:
   *   renderAddForm={(close) => <ClientForm onSuccess={close} />}
   */
  renderAddForm?: (close: () => void) => React.ReactNode
  /**
   * Renders the form shown inside the Edit modal for a given row. Receives
   * the row's data and a `close` callback. Passing this automatically adds
   * the "..." actions column with an Edit option, e.g.:
   *   renderEditForm={(client, close) => (
   *     <ClientForm client={client} onSuccess={close} />
   *   )}
   */
  renderEditForm?: (row: TData, close: () => void) => React.ReactNode
  /**
   * Called when the user confirms deletion in the built-in AlertDialog.
   * Passing this automatically adds the "..." actions column with a Delete
   * option. Confirmation is handled for you — no need to add your own.
   */
  onDeleteRow?: (row: TData) => void | Promise<void>
  /**
   * Returns a short label for the row shown in the delete confirmation
   * dialog, e.g. (client) => client.name. Defaults to a generic message.
   */
  getRowLabel?: (row: TData) => string
  /** Enable drag-to-reorder rows. Requires createDragColumn() in columns to show a handle. Default: false. */
  enableDragAndDrop?: boolean
  /** Called with the new array whenever rows are reordered. */
  onReorder?: (newData: TData[]) => void
  /** Message shown when there are no rows. */
  emptyMessage?: string
  /** Rows per page. Default: 10. */
  pageSize?: number
  /** Optional content rendered on the left side of the toolbar (e.g. a search input or filters). */
  toolbar?: React.ReactNode
  /** Optional content rendered on the right side of the toolbar (e.g. an "Add" button). */
  toolbarActions?: React.ReactNode
}

export function DataTable<TData extends { id: UniqueIdentifier }>({
  data: initialData,
  columns: baseColumns,
  buttonText,
  renderAddForm,
  renderEditForm,
  onDeleteRow,
  getRowLabel,
  enableDragAndDrop = false,
  onReorder,
  emptyMessage = "No results.",
  pageSize = 10,
  toolbar,
  toolbarActions,
}: DataTableProps<TData>) {
  const [data, setData] = React.useState(() => initialData)
  const [addOpen, setAddOpen] = React.useState(false)
  const [editRow, setEditRow] = React.useState<TData | null>(null)
  const [deleteRow, setDeleteRow] = React.useState<TData | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize,
  })

  // Keep internal state in sync if the caller passes a new data array
  // (e.g. after a fetch), without wiping local reorder state on every render.
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  // Append the "..." actions column automatically when the caller wants
  // edit and/or delete support, so every page doesn't have to redefine it.
  const columns = React.useMemo(() => {
    if (!renderEditForm && !onDeleteRow) return baseColumns
    return [
      ...baseColumns,
      createActionsColumn<TData>({
        onEdit: renderEditForm ? (row) => setEditRow(row) : undefined,
        onDelete: onDeleteRow ? (row) => setDeleteRow(row) : undefined,
      }),
    ]
  }, [baseColumns, renderEditForm, onDeleteRow])

  async function handleConfirmDelete() {
    if (!deleteRow || !onDeleteRow) return
    setIsDeleting(true)
    try {
      await onDeleteRow(deleteRow)
      setDeleteRow(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        const newData = arrayMove(prev, oldIndex, newIndex)
        onReorder?.(newData)
        return newData
      })
    }
  }

  const rows = table.getRowModel().rows

  const body = (
    <TableBody className="**:data-[slot=table-cell]:first:w-8">
      {rows?.length ? (
        enableDragAndDrop ? (
          <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
            {rows.map((row) => (
              <DraggableRow key={row.id} row={row} />
            ))}
          </SortableContext>
        ) : (
          rows.map((row) => <PlainRow key={row.id} row={row} />)
        )
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            {emptyMessage}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )

  const tableEl = (
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-muted">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header, index) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                className={
                  shouldShowRightBorder(index, headerGroup.headers)
                    ? "border-r"
                    : undefined
                }
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      {body}
    </Table>
  )

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 mt-5">
      <div className="flex items-center justify-between gap-2 px-4 lg:px-6">
        <div className="flex flex-2 items-center  gap-2">{toolbar}</div>
        <div className="flex justify-between w-full items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
              <Columns3Icon data-icon="inline-start" />
              Columns
              <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {renderAddForm && (
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger render={<Button className="bg-black text-white" />}>
                <PlusIcon />
                Add {buttonText}
              </DialogTrigger>
              <DialogContent>
                {renderAddForm(() => setAddOpen(false))}
              </DialogContent>
            </Dialog>
          )}
          {toolbarActions}
        </div>
      </div>

      <div className="px-4 lg:px-6 min-w-0">
        <div className="overflow-auto max-h-[600px] min-w-0 bg-white rounded-lg border">
          {enableDragAndDrop ? (
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              {tableEl}
            </DndContext>
          ) : (
            tableEl
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="hidden flex-1 text-sm  text-black lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm text-black font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
              items={[10, 20, 30, 40, 50].map((size) => ({
                label: `${size}`,
                value: `${size}`,
              }))}
            >
              <SelectTrigger size="sm" className="w-20 text-black" id="rows-per-page">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectGroup>
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit text-black items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>

      {renderEditForm && (
        <Dialog
          open={editRow !== null}
          onOpenChange={(open) => {
            if (!open) setEditRow(null)
          }}
        >
          <DialogContent>
            {editRow !== null && renderEditForm(editRow, () => setEditRow(null))}
          </DialogContent>
        </Dialog>
      )}

      {onDeleteRow && (
        <AlertDialog
          open={deleteRow !== null}
          onOpenChange={(open) => {
            if (!open && !isDeleting) setDeleteRow(null)
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteRow
                  ? `This will permanently delete ${
                      getRowLabel ? getRowLabel(deleteRow) : "this item"
                    }. This action cannot be undone.`
                  : ""}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}