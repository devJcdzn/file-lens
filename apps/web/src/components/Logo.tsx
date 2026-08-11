export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden>
      <rect width="512" height="512" rx="118" fill="#3b6ef5" />
      <rect x="150" y="112" width="212" height="288" rx="26" fill="#ffffff" />
      <path d="M288 112l72 72h-48c-13.3 0-24-10.7-24-24v-48z" fill="#eef1f8" />
      <rect x="192" y="242" width="128" height="16" rx="8" fill="#3b6ef5" />
      <rect x="192" y="278" width="96" height="13" rx="6.5" fill="#0d9f8c" />
      <rect x="192" y="311" width="116" height="13" rx="6.5" fill="#c5cdd9" />
      <rect x="192" y="344" width="76" height="13" rx="6.5" fill="#c5cdd9" />
    </svg>
  )
}
