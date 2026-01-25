
import { useState } from 'react';
import getTimeAgo from '../utils/time';
import { Clock, Search, X, FileText } from 'lucide-react';
import DeleteIcon from './DeleteIcon';

function Sidebar({
  pages,
  selectedPageId,
  handleSelectedPage,
  handleDeletePage,
  isOpen,
  onToggle,
  pageSearchQuery,
  setPageSearchQuery,
  textSearchQuery,
  setTextSearchQuery,
  showTextSearch,
  setShowTextSearch,
  pagesWithTextMatches
}) {
  const [localSearchMode, setLocalSearchMode] = useState('pages');

  const handlePageSearchChange = (e) => {
    setPageSearchQuery(e.target.value);
    setLocalSearchMode('pages');
    if (e.target.value) setShowTextSearch(false);
  };

  const handleTextSearchChange = (e) => {
    setTextSearchQuery(e.target.value);
    setLocalSearchMode('text');
  };

  const clearPageSearch = () => {
    setPageSearchQuery("");
  };

  const clearTextSearch = () => {
    setTextSearchQuery("");
  };

  const toggleSearchMode = () => {
    setShowTextSearch(!showTextSearch);
    if (showTextSearch) {
      setTextSearchQuery("");
    } else {
      setPageSearchQuery("");
    }
  };

  const displayPages = localSearchMode === 'text' && textSearchQuery
    ? pagesWithTextMatches
    : pages;

  const hasResults = displayPages && displayPages.length > 0;
  const showNoResults = !hasResults && (pageSearchQuery || textSearchQuery);

  return (
    <aside
      className={`fixed top-0 left-0 h-full inset-0 bg-[var(--color-paper-dark)] dark:bg-[var(--color-paper-darker)] border-r border-[var(--border-light)] flex flex-col z-10 transition-all duration-300 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64`}
    >
      {/* Documents List */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 pt-16 px-3">

        {/* List Header */}
        <div className="flex-none flex items-center justify-between mb-3 px-1">
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[var(--color-ink-muted)]">
            {localSearchMode === 'text' && textSearchQuery ? 'Search Results' : 'Documents'}
          </span>
          <span className="text-[10px] font-mono text-[var(--color-ink-muted)]">{displayPages?.length || 0}</span>
        </div>

        {/* Search Bar */}
        <div className="mb-3 space-y-1.5">
          {!showTextSearch && (
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]" />
              <input
                type="text"
                placeholder="Search titles..."
                value={pageSearchQuery}
                onChange={handlePageSearchChange}
                className="w-full px-8 py-2 text-xs bg-[var(--color-paper)] dark:bg-[var(--color-paper-dark)] border border-[var(--border-light)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
              {pageSearchQuery && (
                <button onClick={clearPageSearch} className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors">
                  <X size={12} />
                </button>
              )}
              <button
                onClick={toggleSearchMode}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors"
                title="Search in documents"
              >
                <FileText size={12} />
              </button>
            </div>
          )}

          {showTextSearch && (
            <div className="relative">
              <FileText size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]" />
              <input
                type="text"
                placeholder="Search content..."
                value={textSearchQuery}
                onChange={handleTextSearchChange}
                className="w-full px-8 py-2 text-xs bg-[var(--color-paper)] dark:bg-[var(--color-paper-dark)] border border-[var(--border-light)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
              {textSearchQuery && (
                <button onClick={clearTextSearch} className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors">
                  <X size={12} />
                </button>
              )}
              <button
                onClick={toggleSearchMode}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors"
                title="Search by title"
              >
                <Search size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Document List */}
        <ul className="flex-1 overflow-y-auto space-y-0.5 pr-1 pb-4">
          {hasResults ? (
            displayPages.map((page) => (
              <li
                key={page.id}
                onClick={() => handleSelectedPage(page.id)}
                className={`group cursor-pointer px-3 py-2.5 transition-all duration-200 flex items-start justify-between ${
                  page.id === selectedPageId
                    ? "bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]"
                    : "hover:bg-[var(--color-paper)] dark:hover:bg-[var(--color-paper-dark)]"
                }`}
              >
                <div className="flex items-start gap-2.5 overflow-hidden">
                  <div className={`w-1 h-5 mt-0.5 shrink-0 rounded-full transition-colors ${
                    page.id === selectedPageId ? 'bg-[var(--color-accent)]' : 'bg-transparent'
                  }`} />

                  <div className="flex flex-col gap-0.5 overflow-hidden min-w-0">
                    <span className={`text-sm truncate ${
                      page.title?.trim()
                        ? "text-[var(--color-ink)] font-normal"
                        : "text-[var(--color-ink-muted)] italic"
                    }`}>
                      {page.title?.trim() || "Untitled"}
                    </span>

                    <span className="flex items-center gap-1 text-[10px] text-[var(--color-ink-muted)]">
                      <Clock size={10} strokeWidth={2} />
                      <span className="truncate font-mono">{getTimeAgo(page.createdAt)}</span>
                      {page.matchCount && (
                        <span className="ml-1 px-1.5 py-0.5 bg-[var(--color-accent)]/15 text-[var(--color-accent)] rounded-full font-mono text-[9px]">
                          {page.matchCount}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePage(page.id);
                  }}
                  className="p-1 text-[var(--color-ink-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <DeleteIcon size={14} />
                </button>
              </li>
            ))
          ) : (
            showNoResults && (
              <li className="px-3 py-12 text-center text-[var(--color-ink-muted)] text-sm">
                <Search size={20} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">No documents found</p>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Branding */}
      <div className="flex-none p-4 border-t border-[var(--border-light)]">
        <h1 className="text-2xl font-[var(--font-display)] text-[var(--color-ink)] italic tracking-wide">
          100word
        </h1>
        <p className="text-[9px] text-[var(--color-accent)] tracking-[0.25em] uppercase mt-1">
          Minimal Writer
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
