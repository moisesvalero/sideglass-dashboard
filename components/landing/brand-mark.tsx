import Image from "next/image"

export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/icon.svg"
      alt=""
      width={size}
      height={size}
      className="rounded-lg shrink-0"
      aria-hidden
    />
  )
}
