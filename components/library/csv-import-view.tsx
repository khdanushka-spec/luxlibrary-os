"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2, Download, Upload } from "lucide-react";
import { bulkImportBooks, type BulkImportResult } from "@/lib/import-actions";
import { CSV_TEMPLATE_HEADER } from "@/lib/csv";

const SAMPLE_CSV = `${CSV_TEMPLATE_HEADER}
The Midnight Library,Matt Haig,Fantasy,Paperback,Unread,Canongate,,,2020,304,9781786892737,14.99
Circe,Madeline Miller,Fantasy,Hardcover,Completed,Bloomsbury,,,2018,393,9781408890042,22.50`;

export function CsvImportView() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvText, setCsvText] = useState("");
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCsvText(String(reader.result ?? ""));
      setResult(null);
      setError(null);
    };
    reader.readAsText(file);
  }

  function downloadTemplate() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "luxlibrary-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    if (!csvText.trim()) return;
    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const res = await bulkImportBooks(csvText);
        setResult(res);
        if (res.created > 0 || res.updated > 0) router.refresh();
      } catch {
        setError("Something went wrong importing this file.");
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <Link
          href="/library"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Library
        </Link>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <Upload className="size-6 text-gold" />
          Import Books
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Bulk-add books from a CSV file. Only <code>title</code> and{" "}
          <code>author</code> are required. A row whose <code>isbn13</code>{" "}
          matches a book you already own updates it instead of creating a
          duplicate.
        </p>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
        <h3 className="mb-2 text-sm font-medium text-foreground">Expected columns</h3>
        <p className="mb-4 break-words font-mono text-xs text-muted-foreground">
          {CSV_TEMPLATE_HEADER}
        </p>
        <button
          onClick={downloadTemplate}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/70 px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Download className="size-3.5" />
          Download sample CSV
        </button>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h3 className="text-sm font-medium text-foreground">CSV content</h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-gold hover:underline"
          >
            Choose a file…
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <textarea
          value={csvText}
          onChange={(e) => {
            setCsvText(e.target.value);
            setResult(null);
            setError(null);
          }}
          rows={10}
          placeholder={CSV_TEMPLATE_HEADER}
          spellCheck={false}
          className="w-full resize-y rounded-lg border border-border/70 bg-secondary/40 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
        />

        {error && (
          <p className="mt-4 flex items-center gap-1.5 text-xs text-rose-400">
            <AlertTriangle className="size-3.5" />
            {error}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleImport}
            disabled={isPending || !csvText.trim()}
            className="h-9 rounded-full bg-gold px-5 text-sm font-medium text-gold-foreground disabled:opacity-60"
          >
            {isPending ? "Importing…" : "Import Books"}
          </button>
        </div>
      </div>

      {result && (
        <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CheckCircle2 className="size-4 text-gold" />
            {result.created > 0 && (
              <span>
                Added {result.created} book{result.created === 1 ? "" : "s"}.
              </span>
            )}
            {result.updated > 0 && (
              <span>
                Updated {result.updated} book{result.updated === 1 ? "" : "s"}.
              </span>
            )}
            {result.created === 0 && result.updated === 0 && <span>Nothing imported.</span>}
          </div>
          {result.skipped.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs text-rose-400">
                <AlertTriangle className="size-3.5" />
                {result.skipped.length} row{result.skipped.length === 1 ? "" : "s"} skipped
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {result.skipped.map((s, i) => (
                  <li key={i}>
                    Row {s.row}: {s.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
