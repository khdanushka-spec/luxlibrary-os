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
  originalPublicationYear?: number;
  pages?: number;
  isbn13?: string;
  isbn10?: string;
  purchasePrice?: number;
  subtitle?: string;
  country?: string;
  condition?: string;
  language?: string;
  tags?: string;
  isFavorite?: boolean;
  isRare?: boolean;
  isSigned?: boolean;
  isFirstEdition?: boolean;
  isLimitedEdition?: boolean;
  weightGrams?: number;
  widthMm?: number;
  heightMm?: number;
  depthMm?: number;
  qrCode?: string;
};

export type ParsedCsv = {
  rows: CsvBookRow[];
  skipped: { row: number; reason: string }[];
};

export const CSV_TEMPLATE_HEADER =
  "title,subtitle,author,genre,format,status,publisher,series,seriesVolume,year,originalPublicationYear,pages,isbn13,isbn10,country,language,condition,purchasePrice,tags,isFavorite,isRare,isSigned,isFirstEdition,isLimitedEdition,weightGrams,widthMm,heightMm,depthMm,qrCode";

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

function toBoolean(value: string): boolean {
  return ["true", "yes", "y", "1"].includes(value.trim().toLowerCase());
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
      originalPublicationYear: record.originalpublicationyear
        ? toNumber(record.originalpublicationyear)
        : undefined,
      pages: record.pages ? toNumber(record.pages) : undefined,
      isbn13: record.isbn13 || undefined,
      isbn10: record.isbn10 || undefined,
      purchasePrice: record.purchaseprice ? toNumber(record.purchaseprice) : undefined,
      subtitle: record.subtitle || undefined,
      country: record.country || undefined,
      condition: record.condition || undefined,
      language: record.language || undefined,
      tags: record.tags || undefined,
      isFavorite: record.isfavorite ? toBoolean(record.isfavorite) : undefined,
      isRare: record.israre ? toBoolean(record.israre) : undefined,
      isSigned: record.issigned ? toBoolean(record.issigned) : undefined,
      isFirstEdition: record.isfirstedition ? toBoolean(record.isfirstedition) : undefined,
      isLimitedEdition: record.islimitededition ? toBoolean(record.islimitededition) : undefined,
      weightGrams: record.weightgrams ? toNumber(record.weightgrams) : undefined,
      widthMm: record.widthmm ? toNumber(record.widthmm) : undefined,
      heightMm: record.heightmm ? toNumber(record.heightmm) : undefined,
      depthMm: record.depthmm ? toNumber(record.depthmm) : undefined,
      qrCode: record.qrcode || undefined,
    });
  }

  return { rows, skipped };
}
