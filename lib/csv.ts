export type CsvBookRow = {
  rowNumber: number;
  title: string;
  author: string;
  genre?: string;
  format?: string;
  status?: string;
  publisher?: string;
  series?: string;
  seriesVolume?: number;
  year?: number;
  pages?: number;
  isbn13?: string;
  purchasePrice?: number;
};

export type ParsedCsv = {
  rows: CsvBookRow[];
  skipped: { row: number; reason: string }[];
};

export const CSV_TEMPLATE_HEADER =
  "title,author,genre,format,status,publisher,series,seriesVolume,year,pages,isbn13,purchasePrice";

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      cells.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells;
}

function toNumber(value: string): number | undefined {
  const n = Number(value);
  return value && !Number.isNaN(n) ? n : undefined;
}

export function parseBookCsv(text: string): ParsedCsv {
  const lines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    return { rows: [], skipped: [{ row: 0, reason: "The file is empty." }] };
  }

  const header = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const rows: CsvBookRow[] = [];
  const skipped: { row: number; reason: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowNumber = i + 1;
    const cells = parseCsvLine(lines[i]);
    const record: Record<string, string> = {};
    header.forEach((h, idx) => {
      record[h] = (cells[idx] ?? "").trim();
    });

    if (!record.title || !record.author) {
      skipped.push({ row: rowNumber, reason: "Missing title or author." });
      continue;
    }

    rows.push({
      rowNumber,
      title: record.title,
      author: record.author,
      genre: record.genre || undefined,
      format: record.format || undefined,
      status: record.status || undefined,
      publisher: record.publisher || undefined,
      series: record.series || undefined,
      seriesVolume: record.seriesvolume ? toNumber(record.seriesvolume) : undefined,
      year: record.year ? toNumber(record.year) : undefined,
      pages: record.pages ? toNumber(record.pages) : undefined,
      isbn13: record.isbn13 || undefined,
      purchasePrice: record.purchaseprice ? toNumber(record.purchaseprice) : undefined,
    });
  }

  return { rows, skipped };
}
