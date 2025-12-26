export default function ToolbarButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center
        w-9 h-9 rounded-lg transition-all duration-200 ease-in-out
        /* When active, we slightly darken the icon and add a very faint background */
        ${active
          ? "text-neutral-900 dark:text-neutral-100 bg-neutral-100/50 dark:bg-neutral-700/50 font-bold" 
          : "text-neutral-400 dark:text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 hover:text-neutral-700 dark:hover:text-neutral-300"}
      `}
    >
      <div className={`transition-transform duration-200 ${active ? "scale-105" : "scale-100"}`}>
        {children}
      </div>
    </button>
  );
}