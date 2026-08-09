export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 5.5C6 4.67 6.67 4 7.5 4H15v24H7.5A1.5 1.5 0 0 1 6 26.5v-21Z"
        className="fill-gold/25 stroke-gold"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M26 5.5c0-.83-.67-1.5-1.5-1.5H17v24h7.5a1.5 1.5 0 0 0 1.5-1.5v-21Z"
        className="fill-gold/10 stroke-gold"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M16 4v24"
        className="stroke-gold"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
