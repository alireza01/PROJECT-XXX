import Button from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="ml-auto hidden h-8 lg:flex">
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          نمایش
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuItem
                key={column.id}
                className="capitalize"
                onSelect={() => column.toggleVisibility(!column.getIsVisible())}
              >
                {column.id}
              </DropdownMenuItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 