export type MockNote = {
  id: string;
  bookId: string;
  date: string;
  content: string;
  title?: string;
};

export const MOCK_NOTES: MockNote[] = [
  {
    id: "n1",
    bookId: "3",
    date: "2026-08-05",
    content:
      "The narrator's voice is doing something I haven't seen since Never Let Me Go — that same quiet devastation hiding behind plain sentences. Taking it slow on purpose.",
  },
  {
    id: "n2",
    bookId: "9",
    date: "2026-07-22",
    content:
      "Finished on the porch during a thunderstorm — felt appropriate for the ending. Might be my favorite Miller yet.",
  },
  {
    id: "n3",
    bookId: "8",
    date: "2026-07-10",
    content:
      "Reread the last thirty pages twice. Still not sure I've fully understood the House, and I don't think I'm meant to.",
  },
  {
    id: "n4",
    bookId: "26",
    date: "2026-06-28",
    content:
      "Recommended by three different people this year before I finally picked it up. They were right — could not put this down.",
  },
  {
    id: "n5",
    bookId: "5",
    date: "2026-06-02",
    content:
      "Chapter 7 changed how I think about the agricultural revolution. Need to go back through my highlights and pull quotes for the AI Librarian.",
  },
  {
    id: "n6",
    bookId: "13",
    date: "2026-05-19",
    content:
      "Gethen's ambisexuality is handled with more nuance than I expected for a book published in 1969. Want to read the rest of the Hainish Cycle in order next.",
  },
];
