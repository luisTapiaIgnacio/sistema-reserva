type MarqueeProps = {
  items: string[];
  variant?: "dark" | "light";
  /** Velocidad aproximada en píxeles por segundo. */
  speed?: number;
};

const ITEM_PADDING_PX = 40; // px-5 a cada lado
const CHAR_PX = 10; // ancho aproximado de un carácter (text-sm, uppercase)
const MIN_ITEMS_PER_GROUP = 12;

export default function Marquee({
  items,
  variant = "dark",
  speed = 130,
}: MarqueeProps) {
  if (items.length === 0) return null;

  // Se repite la lista solo para que, con pocos servicios, no queden muy separados.
  const repeat = Math.max(1, Math.ceil(MIN_ITEMS_PER_GROUP / items.length));
  const list = Array.from({ length: repeat }, () => items).flat();

  const approxWidth = list.reduce(
    (total, text) => total + text.length * CHAR_PX + ITEM_PADDING_PX,
    0
  );
  const duration = Math.max(10, approxWidth / speed);

  const textColor = variant === "dark" ? "text-white" : "text-heading";

  const renderGroup = (hidden: boolean) => (
    <div
      aria-hidden={hidden || undefined}
      className="animate-marquee flex min-w-full shrink-0 items-center justify-around"
      style={{ animationDuration: `${duration}s` }}
    >
      {list.map((text, i) => (
        <span
          key={i}
          className={`whitespace-nowrap px-5 text-sm font-semibold tracking-wide uppercase ${textColor}`}
        >
          {text}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={
        variant === "dark"
  ? "overflow-hidden bg-primary py-3.5"
  : "overflow-hidden bg-bg-light py-3.5"
      }
    >
      {/*
        Dos grupos idénticos, cada uno con ancho mínimo = ancho de la pantalla.
        Cada grupo se desplaza -100% de SU PROPIO ancho, así que cuando el primero
        sale por la izquierda, el segundo ocupa exactamente su lugar: cinta sin fin.
      */}
      <div className="flex">
        {renderGroup(false)}
        {renderGroup(true)}
      </div>
    </div>
  );
}