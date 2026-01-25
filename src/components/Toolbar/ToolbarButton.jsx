export default function ToolbarButton({ active, onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        flex items-center justify-center
        w-8 h-8 transition-all duration-300 ease-out
        ${active
          ? "text-[var(--color-accent)] bg-[var(--color-paper-dark)]"
          : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-darker)]"}
      `}
    >
      <div className={`transition-all duration-200 ${active ? "scale-110" : "scale-100"}`}>
        {children}
      </div>
    </button>
  );
}