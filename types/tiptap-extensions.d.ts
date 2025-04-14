declare module '@tiptap/extension-image' {
  import { Extension } from '@tiptap/core'
  export interface ImageOptions {
    HTMLAttributes: Record<string, any>
  }
  export const Image: Extension<ImageOptions>
}

declare module '@tiptap/extension-table' {
  import { Extension } from '@tiptap/core'
  export interface TableOptions {
    resizable: boolean
    HTMLAttributes: Record<string, any>
  }
  export const Table: Extension<TableOptions>
}

declare module '@tiptap/extension-table-row' {
  import { Extension } from '@tiptap/core'
  export interface TableRowOptions {
    HTMLAttributes: Record<string, any>
  }
  export const TableRow: Extension<TableRowOptions>
}

declare module '@tiptap/extension-table-cell' {
  import { Extension } from '@tiptap/core'
  export interface TableCellOptions {
    HTMLAttributes: Record<string, any>
  }
  export const TableCell: Extension<TableCellOptions>
}

declare module '@tiptap/extension-table-header' {
  import { Extension } from '@tiptap/core'
  export interface TableHeaderOptions {
    HTMLAttributes: Record<string, any>
  }
  export const TableHeader: Extension<TableHeaderOptions>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (options: { src: string; alt?: string }) => ReturnType
    }
    table: {
      insertTable: (options: { rows: number; cols: number; withHeaderRow?: boolean }) => ReturnType
    }
  }
} 