"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Plus, X } from "lucide-react";
import { addBook } from "@/lib/book-actions";
import { getShelfOptions } from "@/lib/shelf-actions";
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

const FORMAT_OPTIONS = ["Hardcover", "Paperback", "Ebook", "Audiobook", "Leather"];
const STATUS_OPTIONS = ["Wishlist", "Unread", "Reading", "Completed", "DNF"];
const CONDITION_OPTIONS = [
  { label: "New", value: "NEW" },
  { label: "Like New", value: "LIKE_NEW" },
  { label: "Very Good", value: "VERY_GOOD" },
  { label: "Good", value: "GOOD" },
  { label: "Fair", value: "FAIR" },
  { label: "Poor", value: "POOR" },
];

export function AddBookDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState(GENRE_OPTIONS[0]);
  const [format, setFormat] = useState(FORMAT_OPTIONS[0]);
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [publisher, setPublisher] = useState("");
  const [isbn13, setIsbn13] = useState("");
  const [pages, setPages] = useState("");
  const [year, setYear] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [series, setSeries] = useState("");
  const [seriesVolume, setSeriesVolume] = useState("");
  const [condition, setCondition] = useState("");
  const [language, setLanguage] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [readingProgressPercent, setReadingProgressPercent] = useState("");
  const [tags, setTags] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRare, setIsRare] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isbn10, setIsbn10] = useState("");
  const [originalPublicationYear, setOriginalPublicationYear] = useState("");
  const [country, setCountry] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const [isFirstEdition, setIsFirstEdition] = useState(false);
  const [isLimitedEdition, setIsLimitedEdition] = useState(false);
  const [weightGrams, setWeightGrams] = useState("");
  const [widthMm, setWidthMm] = useState("");
  const [heightMm, setHeightMm] = useState("");
  const [depthMm, setDepthMm] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [shelfId, setShelfId] = useState("");
  const [shelfPosition, setShelfPosition] = useState("");
  const [shelves, setShelves] = useState<ShelfOption[]>([]);

  useEffect(() => {
    if (!open || shelves.length > 0) return;
    getShelfOptions().then(setShelves);
  }, [open, shelves.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    setSubmitted(false);
    setError(null);
    setTitle("");
    setAuthor("");
    setGenre(GENRE_OPTIONS[0]);
    setFormat(FORMAT_OPTIONS[0]);
    setStatus(STATUS_OPTIONS[0]);
    setPublisher("");
    setIsbn13("");
    setPages("");
    setYear("");
    setPurchasePrice("");
    setSeries("");
    setSeriesVolume("");
    setCondition("");
    setLanguage("");
    setCurrentPage("");
    setReadingProgressPercent("");
    setTags("");
    setIsFavorite(false);
    setIsRare(false);
    setSubtitle("");
    setCoverImageUrl("");
    setIsbn10("");
    setOriginalPublicationYear("");
    setCountry("");
    setIsSigned(false);
    setIsFirstEdition(false);
    setIsLimitedEdition(false);
    setWeightGrams("");
    setWidthMm("");
    setHeightMm("");
    setDepthMm("");
    setQrCode("");
    setExternalLink("");
    setShelfId("");
    setShelfPosition("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    setError(null);

    startTransition(async () => {
      const result = await addBook({
        title,
        author,
        genre,
        format,
        status,
        publisher: publisher.trim() || undefined,
        isbn13: isbn13.trim() || undefined,
        pages: pages ? Number(pages) : null,
        year: year ? Number(year) : null,
        purchasePrice: purchasePrice ? Number(purchasePrice) : null,
        series: series.trim() || undefined,
        seriesVolume: seriesVolume ? Number(seriesVolume) : null,
        condition: condition || undefined,
        language: language.trim() || undefined,
        currentPage: currentPage ? Number(currentPage) : null,
        readingProgressPercent: readingProgressPercent ? Number(readingProgressPercent) : null,
        tags: tags.trim() || undefined,
        isFavorite,
        isRare,
        subtitle: subtitle.trim() || undefined,
        coverImageUrl: coverImageUrl.trim() || undefined,
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
        externalLink: externalLink.trim() || undefined,
        shelfId: shelfId || undefined,
        shelfPosition: shelfPosition ? Number(shelfPosition) : null,
      });
      if (result.ok) {
        setSubmitted(true);
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
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gold px-4 text-sm font-medium text-gold-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="size-4" />
        Add Book
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />
          <div className="glass relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border/70 p-6 shadow-2xl">
            <button
              onClick={close}
              className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 className="mb-4 size-10 text-gold" />
                <h3 className="font-display text-xl text-foreground">
                  &ldquo;{title}&rdquo; added
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  Saved to your library for real.
                </p>
                <button
                  onClick={close}
                  className="mt-6 h-9 rounded-full bg-gold px-5 text-sm font-medium text-gold-foreground"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="font-display mb-1 text-xl text-foreground">
                  Add a Book
                </h3>
                <p className="mb-5 text-xs text-muted-foreground">
                  Saved directly to your library.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Title *
                    </label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="The Night Circus"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
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
                      placeholder="Erin Morgenstern"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
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

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Cover image URL
                    </label>
                    <input
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      placeholder="https://…"
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
                        onChange={(e) => setFormat(e.target.value)}
                        className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                      >
                        {FORMAT_OPTIONS.map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Reading status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-2.5 text-sm text-foreground focus:border-gold/40 focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {status === "Reading" && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Current page{pages ? ` (of ${pages})` : ""}
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={pages ? Number(pages) : undefined}
                        value={currentPage}
                        onChange={(e) => setCurrentPage(e.target.value)}
                        placeholder="120"
                        className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                      />
                      {!pages && (
                        <p className="mt-1 text-[0.7rem] text-muted-foreground">
                          Add a page count above to compute progress automatically.
                        </p>
                      )}
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
                        placeholder="2011"
                        className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
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
                        placeholder="512"
                        className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
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
                        placeholder="978-0385541213"
                        className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
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
                        placeholder="24.99"
                        className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
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
                        placeholder="0385541213"
                        className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
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

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Book link
                    </label>
                    <input
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                      placeholder="Link to buy it, read it, or learn more"
                      className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
                    />
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
                        placeholder="1"
                        className="h-9 w-full rounded-lg border border-border/70 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
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
                    onClick={close}
                    className="h-9 rounded-full border border-border/70 px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="h-9 rounded-full bg-gold px-5 text-sm font-medium text-gold-foreground disabled:opacity-60"
                  >
                    {isPending ? "Adding…" : "Add Book"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
