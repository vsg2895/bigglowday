/** The design's bottle drawing, for a product with no photo; `tint` is the product's own colour. */
export default function BottlePlaceholder({ tint, width = 120, height = 160, label }: { tint: string | null; width?: number; height?: number; label?: string }): React.JSX.Element {
  return (
    <svg
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      width={width}
      height={height}
      viewBox="0 0 120 160"
    >
      <rect x="46" y="8" width="28" height="26" rx="3" fill="#F3F1F6" />
      <rect x="52" y="34" width="16" height="12" fill="#6B6878" />
      <rect x="24" y="46" width="72" height="104" rx="10" fill={tint ?? '#2E2E3A'} />
      <rect x="40" y="84" width="40" height="30" fill="#0F0F14" opacity="0.55" />
    </svg>
  )
}
