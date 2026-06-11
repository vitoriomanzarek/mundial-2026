import clsx from "clsx";

interface TeamFlagProps {
  code: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-4 w-6",
  md: "h-5 w-7",
  lg: "h-8 w-12",
};

export default function TeamFlag({
  code,
  name,
  size = "sm",
  className,
}: TeamFlagProps) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`/flags/${code}.svg`}
      alt={name ? `Bandera de ${name}` : code}
      className={clsx(
        sizes[size],
        "shrink-0 rounded-[3px] object-cover ring-1 ring-white/10",
        className
      )}
      loading="lazy"
    />
  );
}
