"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Pencil, X } from "lucide-react";
import { updateBook } from "@/lib/book-actions";
import type { BookFormat, BookStatus } from "@/lib/mock-data";
import type { ShelfOption } from "@/lib/db-books";

const GENRE_OPTIONS = [
  "Literary Fiction",
  "Fantasy",
  "Science Fiction",
  "History",
  "Science",
  "Philosophy",
  "Biography",
];

const FORMAT_OPTIONS: BookFormat[] = ["Hardcover", "Paperback", "Ebook", "Audiobook", "Leather"];
const STATUS_OPTIONS: { label: string; value: BookStatus }[] = [
  { label: "Wishlist", value: "wishlist" },
  { label: "Unread", value: "unread" },
  { label: "Reading", value: "reading" },
  { label: "Completed", value: "completed" },
  { label: "DNF", value: "dnf" },
];
const CONDITION_OPTIONS = [
  { label: "New", value: "NEW" },
  { label: "Like New", value: "LIKE_NEW" },
  { label: "Very Good", value: "VERY_GOOD" },
  { label: "Good", value: "GOOD" },
  { label: "Fair", value: "FAIR" },
  { label: "Poor", value: "POOR" },
];

type EditBookDialogProps = {
  id: string;
  title: string;
  author: string;
  genre: string;
  format: BookFormat;
  status: BookStatus;
  rating: number | null;
  publisher?: string;
  isbn13?: string;
  pages?: number;
  year?: number;
  purchasePrice?: number;
  series?: string;
  seriesVolume?: number;
  condition?: string;
  language?: string;
  personalReview?: string;
  personalNotes?: string;
  purchaseDate?: string;
  purchaseSeller?: string;
  currentMarketValue?: number;
  insuranceValue?: number;
  readingProgressPercent?: number;
  tags?: string;
  isFavorite?: boolean;
  isRare?: boolean;
  subtitle?: string;
  isbn10?: string;
  originalPublicationYear?: number;
  country?: string;
  isSigned?: boolean;
  isFirstEdition?: boolean;
  isLimitedEdition?: boolean;
  weightGrams?: number;
  widthMm?: number;
  heightMm?: number;
  depthMm?: number;
  qrCode?: string;
  shelfId?: string;
  shelfPosition?: number;
  shelves: ShelfOption[];
};

export function EditBookDialog({
  id,
  title: initialTitle,
  author: initialAuthor,
  genre: initialGenre,
  format: initialFormat,
  status: initialStatus,
  rating: initialRating,
  publisher: initialPublisher,
  isbn13: initialIsbn13,
  pages: initialPages,
  year: initialYear,
  purchasePrice: initialPurchasePrice,
  series: initialSeries,
  seriesVolume: initialSeriesVolume,
  condition: initialCondition,
  language: initialLanguage,
  personalReview: initialPersonalReview,
  personalNotes: initialPersonalNotes,
  purchaseDate: initialPurchaseDate,
  purchaseSeller: initialPurchaseSeller,
  currentMarketValue: initialCurrentMarketValue,
  insuranceValue: initialInsuranceValue,
  readingProgressPercent: initialReadingProgressPercent,
  tags: initialTags,
  isFavorite: initialIsFavorite,
  isRare: initialIsRare,
  subtitle: initialSubtitle,
  isbn10: initialIsbn10,
  originalPublicationYear: initialOriginalPublicationYear,
  country: initialCountry,
  isSigned: initialIsSigned,
  isFirstEdition: initialIsFirstEdition,
  isLimitedEdition: initialIsLimitedEdition,
  weightGrams: initialWeightGrams,
  widthMm: initialWidthMm,
  heightMm: initialHeightMm,
  depthMm: initialDepthMm,
  qrCode: initialQrCode,
  shelfId: initialShelfId,
  shelfPosition: initialShelfPosition,
  shelves,
}: EditBookDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState(initialAuthor);
  const [genre, setGenre] = useState(initialGenre);
  const [format, setFormat] = useState<BookFormat>(initialFormat);
  const [status, setStatus] = useState<BookStatus>(initialStatus);
  const [rating, setRating] = useState<number | null>(initialRating);
  const [publisher, setPublisher] = useState(initialPublisher ?? "");
  const [isbn13, setIsbn13] = useState(initialIsbn13 ?? "");
  const [pages, setPages] = useState(initialPages ? String(initialPages) : "");
  const [year, setYear] = useState(initialYear ? String(initialYear) : "");
  const [purchasePrice, setPurchasePrice] = useState(
    initialPurchasePrice ? String(initialPurchasePrice) : ""
  );
  const [series, setSeries] = useState(initialSeries ?? "");
  const [seriesVolume, setSeriesVolume] = useState(
    initialSeriesVolume ? String(initialSeriesVolume) : ""
  );
  const [condition, setCondition] = useState(initialCondition ?? "");
  const [language, setLanguage] = useState(initialLanguage ?? "");
  const [personalReview, setPersonalReview] = useState(initialPersonalReview ?? "");
  const [personalNotes, setPersonalNotes] = useState(initialPersonalNotes ?? "");
  const [purchaseDate, setPurchaseDate] = useState(initialPurchaseDate ?? "");
  const [purchaseSeller, setPurchaseSeller] = useState(initialPurchaseSeller ?? "");
  const [currentMarketValue, setCurrentMarketValue] = useState(
    initialCurrentMarketValue ? String(initialCurrentMarketValue) : ""
  );
  const [insuranceValue, setInsuranceValue] = useState(
    initialInsuranceValue ? String(initialInsuranceValue) : ""
  );
  const [readingProgressPercent, setReadingProgressPercent] = useState(
    initialReadingProgressPercent ? String(initialReadingProgressPercent) : ""
  );
  const [tags, setTags] = useState(initialTags ?? "");
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite ?? false);
  const [isRare, setIsRare] = useState(initialIsRare ?? false);
  const [subtitle, setSubtitle] = useState(initialSubtitle ?? "");
  const [isbn10, setIsbn10] = useState(initialIsbn10 ?? "");
  const [originalPublicationYear, setOriginalPublicationYear] = useState(
    initialOriginalPublicationYear ? String(initialOriginalPublicationYear) : ""
  );
  const [country, setCountry] = useState(initialCountry ?? "");
  const [isSigned, setIsSigned] = useState(initialIsSigned ?? false);
  const [isFirstEdition, setIsFirstEdition] = useState(initialIsFirstEdition ?? false);
  const [isLimitedEdition, setIsLimitedEdition] = useState(initialIsLimitedEdition ?? false);
  const [weightGrams, setWeightGrams] = useState(
    initialWeightGrams ? String(initialWeightGrams) : ""
  );
  const [widthMm, setWidthMm] = useState(initialWidthMm ? String(initialWidthMm) : "");
  const [heightMm, setHeightMm] = useState(initialHeightMm ? String(initialHeightMm) : "");
  const [depthMm, setDepthMm] = useState(initialDepthMm ? String(initialDepthMm) : "");
  const [qrCode, setQrCode] = useState(initialQrCode ?? "");
  const [shelfId, setShelfId] = useState(initialShelfId ?? "");
  const [shelfPosition, setShelfPosition] = useState(
    initialShelfPosition ? String(initialShelfPosition) : ""
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    setError(null);

    startTransition(async () => {
      const result = await updateBook(id, {
        title,
        author,
        genre,
        format,
        status,
        rating,
        publisher: publisher.trim() || undefined,
        isbn13: isbn13.trim() || undefined,
        pages: pages ? Number(pages) : null,
        year: year ? Number(year) : null,
        purchasePrice: purchasePrice ? Number(purchasePrice) : null,
        series: series.trim() || undefined,
        seriesVolume: seriesVolume ? Number(seriesVolume) : null,
        condition: condition || undefined,
        language: language.trim() || undefined,
        personalReview: personalReview.trim() || undefined,
        personalNotes: personalNotes.trim() || undefined,
        purchaseDate: purchaseDate || undefined,
        purchaseSeller: purchaseSeller.trim() || undefined,
        currentMarketValue: currentMarketValue ? Number(currentMarketValue) : null,
        insuranceValue: insuranceValue ? Number(insuranceValue) : null,
        readingProgressPercent: readingProgressPercent ? Number(readingProgressPercent) : null,
        tags: tags.trim() || undefined,
        isFavorite,
        isRare,
        subtitle: subtitle.trim() || undefined,
        isbn10: isbn10.trim() || undefined,
        originalPublicationYear: originalPublicationYear ? Number(originalPublicationYear) : null,
        country: country.trim() || undefined,
        isSigned,
        isFirstEdition,
        isLimitedEdition,
        weightGrams: weightGrams ? Number(weightGrams) : null,
        widthMm: widthMm ? Number(widthMm) : null,
        heightMm: heightMm ? Number(heightMm) : null,
        depthMm: depthMm ? Number(depthMm) : null,
        qrCode: qrCode.trim() || undefined,
        shelfId: shelfId || undefined,
        shelfPosition: shelfPosition ? Number(shelfPosition) : null,
      });
      if (result.ok) {
        setOpen(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/70 px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Pencil className="size-3.5" />
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="glass relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/70 p-6 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            <form onSubmit={handleSubmit}>
              <h3 className="font-display mb-5 text-xl text-foreground">Edit Book</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Title *
                  </label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Author *
                  </label>
                  <input
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Subtitle
                  </label>
                  <input
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="A Novel"
                    className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Genre
                    </label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    >
                      {GENRE_OPTIONS.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as BookFormat)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    >
                      {FORMAT_OPTIONS.map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Reading status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as BookStatus)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Rating
                    </label>
                    <select
                      value={rating ?? ""}
                      onChange={(e) => setRating(e.target.value ? Number(e.target.value) : null)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    >
                      <option value="">No rating</option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} star{n > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {status === "reading" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Progress ({readingProgressPercent || 0}%)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={readingProgressPercent || 0}
                      onChange={(e) => setReadingProgressPercent(e.target.value)}
                      className="w-full accent-gold"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Publisher
                  </label>
                  <input
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="Anchor Books"
                    className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Year
                    </label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Pages
                    </label>
                    <input
                      type="number"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      ISBN-13
                    </label>
                    <input
                      value={isbn13}
                      onChange={(e) => setIsbn13(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Purchase price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      ISBN-10
                    </label>
                    <input
                      value={isbn10}
                      onChange={(e) => setIsbn10(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Original pub. year
                    </label>
                    <input
                      type="number"
                      value={originalPublicationYear}
                      onChange={(e) => setOriginalPublicationYear(e.target.value)}
                      placeholder="If different from Year"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Country
                  </label>
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                    className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Dimensions (mm) &amp; weight (g)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <input
                      type="number"
                      value={widthMm}
                      onChange={(e) => setWidthMm(e.target.value)}
                      placeholder="W"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
                    <input
                      type="number"
                      value={heightMm}
                      onChange={(e) => setHeightMm(e.target.value)}
                      placeholder="H"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
                    <input
                      type="number"
                      value={depthMm}
                      onChange={(e) => setDepthMm(e.target.value)}
                      placeholder="D"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
                    <input
                      type="number"
                      value={weightGrams}
                      onChange={(e) => setWeightGrams(e.target.value)}
                      placeholder="Wt"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    QR code
                  </label>
                  <input
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    placeholder="Manually entered code, e.g. LUX-0042"
                    className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Shelf
                    </label>
                    <select
                      value={shelfId}
                      onChange={(e) => setShelfId(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    >
                      <option value="">Unshelved</option>
                      {shelves.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.room ? `${s.room} — ${s.label}` : s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-20">
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Position
                    </label>
                    <input
                      type="number"
                      value={shelfPosition}
                      onChange={(e) => setShelfPosition(e.target.value)}
                      disabled={!shelfId}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Series
                    </label>
                    <input
                      value={series}
                      onChange={(e) => setSeries(e.target.value)}
                      placeholder="Earthsea Cycle"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                  <div className="w-20">
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Vol.
                    </label>
                    <input
                      type="number"
                      value={seriesVolume}
                      onChange={(e) => setSeriesVolume(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Condition
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    >
                      <option value="">Unspecified</option>
                      {CONDITION_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Language
                    </label>
                    <input
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      placeholder="English"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Purchase date
                    </label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Purchased from
                    </label>
                    <input
                      value={purchaseSeller}
                      onChange={(e) => setPurchaseSeller(e.target.value)}
                      placeholder="Powell's Books"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Current market value
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentMarketValue}
                      onChange={(e) => setCurrentMarketValue(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Insurance value
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={insuranceValue}
                      onChange={(e) => setInsuranceValue(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Your review
                  </label>
                  <textarea
                    value={personalReview}
                    onChange={(e) => setPersonalReview(e.target.value)}
                    rows={2}
                    placeholder="What did you think?"
                    className="w-full resize-none rounded-lg border border-border/70 bg-secondary/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Personal notes
                  </label>
                  <textarea
                    value={personalNotes}
                    onChange={(e) => setPersonalNotes(e.target.value)}
                    rows={2}
                    placeholder="Edition details, where you found it, anything else worth remembering"
                    className="w-full resize-none rounded-lg border border-border/70 bg-secondary/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Tags
                  </label>
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="signed, gift, book club"
                    className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                  />
                  <p className="mt-1 text-[0.7rem] text-muted-foreground">
                    Comma-separated
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={isFavorite}
                      onChange={(e) => setIsFavorite(e.target.checked)}
                      className="size-4 accent-gold"
                    />
                    Favorite
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={isRare}
                      onChange={(e) => setIsRare(e.target.checked)}
                      className="size-4 accent-gold"
                    />
                    Rare / special edition
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={isSigned}
                      onChange={(e) => setIsSigned(e.target.checked)}
                      className="size-4 accent-gold"
                    />
                    Signed
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={isFirstEdition}
                      onChange={(e) => setIsFirstEdition(e.target.checked)}
                      className="size-4 accent-gold"
                    />
                    First edition
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={isLimitedEdition}
                      onChange={(e) => setIsLimitedEdition(e.target.checked)}
                      className="size-4 accent-gold"
                    />
                    Limited edition
                  </label>
                </div>
              </div>

              {error && (
                <p className="mt-4 flex items-center gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="size-3.5" />
                  {error}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="h-9 rounded-full border border-border/70 px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-9 rounded-full bg-gold px-5 text-sm font-medium text-gold-foreground disabled:opacity-60"
                >
                  {isPending ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
