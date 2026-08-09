export const MOCK_OWNER_NAME = "Dhanushka";

export const MOCK_STATS = {
  totalBooks: 2148,
  currentlyReading: 4,
  addedThisMonth: 12,
  collectionValueUsd: 84250,
  readingStreakDays: 46,
  countriesRepresented: 61,
};

export const MOCK_TODAYS_PICK = {
  title: "The Night Circus",
  author: "Erin Morgenstern",
  reason:
    "You finished two literary fantasies this month and rated both 5 stars — this one's been on Shelf B2 for 94 days.",
  coverColor: "from-violet-500/60 to-rose-500/40",
};

export const MOCK_CONTINUE_READING = [
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    progress: 72,
    coverColor: "from-sky-500/60 to-emerald-500/40",
  },
  {
    title: "The Overstory",
    author: "Richard Powers",
    progress: 34,
    coverColor: "from-emerald-500/60 to-gold/40",
  },
  {
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    progress: 91,
    coverColor: "from-rose-400/60 to-orange-400/40",
  },
  {
    title: "Educated",
    author: "Tara Westover",
    progress: 18,
    coverColor: "from-amber-400/60 to-rose-400/40",
  },
];

export const MOCK_RECENTLY_ADDED = [
  { title: "Sapiens", author: "Yuval Noah Harari", coverColor: "from-gold/60 to-amber-300/40" },
  { title: "Helgoland", author: "Carlo Rovelli", coverColor: "from-sky-400/60 to-violet-400/40" },
  { title: "The Song of Achilles", author: "Madeline Miller", coverColor: "from-rose-400/60 to-gold/40" },
  { title: "Piranesi", author: "Susanna Clarke", coverColor: "from-emerald-400/60 to-sky-400/40" },
  { title: "Circe", author: "Madeline Miller", coverColor: "from-violet-400/60 to-rose-400/40" },
  { title: "Cloud Cuckoo Land", author: "Anthony Doerr", coverColor: "from-teal-400/60 to-gold/40" },
];

export const MOCK_AI_INSIGHTS = [
  "Your fantasy collection grew 18% this quarter — mostly first editions.",
  "You haven't read anything from South America in 14 months.",
  "Three books on Shelf C1 mention quantum physics — a hidden mini-collection.",
  "Average time to finish a 400-page book: 9 days, down from 13 last year.",
];

export const MOCK_FAVORITE_GENRES = [
  { label: "Literary Fiction", value: 100 },
  { label: "Fantasy", value: 82 },
  { label: "History", value: 68 },
  { label: "Science", value: 54 },
  { label: "Philosophy", value: 41 },
];

export const MOCK_FAVORITE_AUTHORS = [
  { name: "Kazuo Ishiguro", books: 6 },
  { name: "Madeline Miller", books: 4 },
  { name: "Yuval Noah Harari", books: 3 },
  { name: "Ursula K. Le Guin", books: 9 },
];

export const MOCK_READING_CHALLENGE = {
  goal: 60,
  completed: 41,
  year: 2026,
};

export const COVER_GRADIENTS = [
  "from-violet-500/60 to-rose-500/40",
  "from-sky-500/60 to-emerald-500/40",
  "from-rose-400/60 to-orange-400/40",
  "from-amber-400/60 to-rose-400/40",
  "from-gold/60 to-amber-300/40",
  "from-sky-400/60 to-violet-400/40",
  "from-emerald-400/60 to-sky-400/40",
  "from-teal-400/60 to-gold/40",
  "from-rose-400/60 to-gold/40",
  "from-violet-400/60 to-rose-400/40",
];

export function coverGradient(seed: number) {
  return COVER_GRADIENTS[seed % COVER_GRADIENTS.length];
}

export type BookStatus = "wishlist" | "unread" | "reading" | "completed" | "dnf";
export type BookFormat = "Hardcover" | "Paperback" | "Ebook" | "Audiobook" | "Leather";

export type MockBook = {
  id: string;
  title: string;
  author: string;
  genre: string;
  format: BookFormat;
  status: BookStatus;
  rating: number | null;
  pages: number;
  year: number;
};

export const MOCK_BOOKS: MockBook[] = [
  { id: "1", title: "Project Hail Mary", author: "Andy Weir", genre: "Science Fiction", format: "Hardcover", status: "reading", rating: null, pages: 476, year: 2021 },
  { id: "2", title: "The Overstory", author: "Richard Powers", genre: "Literary Fiction", format: "Paperback", status: "reading", rating: null, pages: 502, year: 2018 },
  { id: "3", title: "Klara and the Sun", author: "Kazuo Ishiguro", genre: "Literary Fiction", format: "Hardcover", status: "reading", rating: null, pages: 303, year: 2021 },
  { id: "4", title: "Educated", author: "Tara Westover", genre: "Biography", format: "Paperback", status: "reading", rating: null, pages: 334, year: 2018 },
  { id: "5", title: "Sapiens", author: "Yuval Noah Harari", genre: "History", format: "Hardcover", status: "completed", rating: 5, pages: 443, year: 2011 },
  { id: "6", title: "Helgoland", author: "Carlo Rovelli", genre: "Science", format: "Hardcover", status: "completed", rating: 4, pages: 185, year: 2020 },
  { id: "7", title: "The Song of Achilles", author: "Madeline Miller", genre: "Fantasy", format: "Paperback", status: "completed", rating: 5, pages: 416, year: 2011 },
  { id: "8", title: "Piranesi", author: "Susanna Clarke", genre: "Fantasy", format: "Hardcover", status: "completed", rating: 5, pages: 245, year: 2020 },
  { id: "9", title: "Circe", author: "Madeline Miller", genre: "Fantasy", format: "Paperback", status: "completed", rating: 5, pages: 393, year: 2018 },
  { id: "10", title: "Cloud Cuckoo Land", author: "Anthony Doerr", genre: "Literary Fiction", format: "Hardcover", status: "unread", rating: null, pages: 626, year: 2021 },
  { id: "11", title: "The Night Circus", author: "Erin Morgenstern", genre: "Fantasy", format: "Hardcover", status: "unread", rating: null, pages: 512, year: 2011 },
  { id: "12", title: "Quantum: A Guide for the Perplexed", author: "Jim Al-Khalili", genre: "Science", format: "Paperback", status: "unread", rating: null, pages: 256, year: 2003 },
  { id: "13", title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", genre: "Science Fiction", format: "Paperback", status: "completed", rating: 4, pages: 304, year: 1969 },
  { id: "14", title: "A Wizard of Earthsea", author: "Ursula K. Le Guin", genre: "Fantasy", format: "Paperback", status: "completed", rating: 5, pages: 183, year: 1968 },
  { id: "15", title: "The Dispossessed", author: "Ursula K. Le Guin", genre: "Science Fiction", format: "Paperback", status: "unread", rating: null, pages: 341, year: 1974 },
  { id: "16", title: "Never Let Me Go", author: "Kazuo Ishiguro", genre: "Literary Fiction", format: "Paperback", status: "completed", rating: 5, pages: 288, year: 2005 },
  { id: "17", title: "The Remains of the Day", author: "Kazuo Ishiguro", genre: "Literary Fiction", format: "Hardcover", status: "completed", rating: 4, pages: 258, year: 1989 },
  { id: "18", title: "An Artist of the Floating World", author: "Kazuo Ishiguro", genre: "Literary Fiction", format: "Paperback", status: "unread", rating: null, pages: 206, year: 1986 },
  { id: "19", title: "Homo Deus", author: "Yuval Noah Harari", genre: "History", format: "Hardcover", status: "completed", rating: 4, pages: 450, year: 2015 },
  { id: "20", title: "21 Lessons for the 21st Century", author: "Yuval Noah Harari", genre: "History", format: "Paperback", status: "wishlist", rating: null, pages: 372, year: 2018 },
  { id: "21", title: "Meditations", author: "Marcus Aurelius", genre: "Philosophy", format: "Leather", status: "completed", rating: 5, pages: 254, year: 180 },
  { id: "22", title: "The Consolations of Philosophy", author: "Alain de Botton", genre: "Philosophy", format: "Paperback", status: "dnf", rating: 2, pages: 288, year: 2000 },
  { id: "23", title: "Braiding Sweetgrass", author: "Robin Wall Kimmerer", genre: "Science", format: "Paperback", status: "wishlist", rating: null, pages: 391, year: 2013 },
  { id: "24", title: "The Order of Time", author: "Carlo Rovelli", genre: "Science", format: "Hardcover", status: "unread", rating: null, pages: 224, year: 2017 },
  { id: "25", title: "The Goldfinch", author: "Donna Tartt", genre: "Literary Fiction", format: "Paperback", status: "completed", rating: 4, pages: 771, year: 2013 },
  { id: "26", title: "The Secret History", author: "Donna Tartt", genre: "Literary Fiction", format: "Hardcover", status: "completed", rating: 5, pages: 559, year: 1992 },
  { id: "27", title: "Pachinko", author: "Min Jin Lee", genre: "Literary Fiction", format: "Paperback", status: "wishlist", rating: null, pages: 490, year: 2017 },
  { id: "28", title: "The Three-Body Problem", author: "Liu Cixin", genre: "Science Fiction", format: "Hardcover", status: "unread", rating: null, pages: 400, year: 2008 },
];
