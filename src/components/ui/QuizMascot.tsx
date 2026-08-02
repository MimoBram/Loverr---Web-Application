/**
 * The Quiz Interaction bot mascot — a friendly rounded bear-like face.
 * Matches the finalized mascot from Figma (task: "Redesign Quiz Interaction
 * bot mascot to be cuter/interactive"). Reproduced as static SVG shapes.
 */
export function QuizMascot({ className, size = 200 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 200 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* ears */}
      <path d="M28 55 L52 8 L64 60 Z" fill="#a8634d" />
      <path d="M172 55 L148 8 L136 60 Z" fill="#a8634d" />
      {/* body */}
      <rect x="0" y="10" width="200" height="160" rx="70" fill="#a8634d" />
      {/* side paws */}
      <rect x="-16" y="60" width="32" height="18" rx="9" fill="#a8634d" transform="rotate(-12 0 69)" />
      <rect x="184" y="58" width="32" height="18" rx="9" fill="#a8634d" transform="rotate(28 200 67)" />
      {/* face */}
      <rect x="28" y="42" width="144" height="105" rx="45" fill="#e97045" />
      {/* gem */}
      <rect x="91" y="0" width="18" height="18" rx="4" fill="#d62e45" transform="rotate(45 100 9)" />
      {/* eyes */}
      <ellipse cx="72" cy="90" rx="7" ry="5" fill="#1a171c" />
      <ellipse cx="128" cy="90" rx="7" ry="5" fill="#1a171c" />
      {/* blush */}
      <ellipse cx="52" cy="104" rx="8" ry="5" fill="#d62e45" opacity="0.5" />
      <ellipse cx="148" cy="104" rx="8" ry="5" fill="#d62e45" opacity="0.5" />
      {/* smile */}
      <path
        d="M82 108 Q100 122 118 108"
        stroke="#1a171c"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
