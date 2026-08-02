/** Small 4-point sparkle/twinkle accent used as scattered decoration on hero screens. */
export function Sparkle({
  className,
  size = 20,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 0C12.6 7.2 12.8 11.4 24 12C11.4 12.8 12.6 16.8 12 24C11.4 16.8 12.6 12.8 0 12C11.4 11.4 11.4 7.2 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
