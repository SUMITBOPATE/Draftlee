
import { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor/Editor";
import { PanelRightClose, SquarePlus, Moon, Sun, Search, X, FileDown, Type, Calculator, Maximize2 } from "lucide-react";
import { useDarkMode } from "./contexts/useDarkMode";
import {
  getAllPages,
  addPage,
  updatePage,
  deletePage,
} from "./db/db";
import { contentContainsText, countTextOccurrences, getTextFromContent } from "./utils/content";
import { exportToPDF } from "./utils/pdfExport";

// Helper to count words in content
function countWords(content) {
  const text = getTextFromContent(content);
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

// Helper to calculate reading time (average 200 words per minute)
function calculateReadingTime(content) {
  const wordCount = countWords(content);
  const minutes = Math.ceil(wordCount / 200);
  return minutes < 1 ? '<1' : minutes;
}


function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pageSearchQuery, setPageSearchQuery] = useState("");
  const [textSearchQuery, setTextSearchQuery] = useState("");
  const [showTextSearch, setShowTextSearch] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bodyEditor, setBodyEditor] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const editorRef = useRef(null);

  // Handle font style change
  const setFontFamily = (fontFamily) => {
    if (!bodyEditor) return;

    if (fontFamily) {
      bodyEditor.chain().focus().setMark('fontFamily', { fontFamily }).run();
    } else {
      bodyEditor.chain().focus().unsetMark('fontFamily').run();
    }
  };

  // Font options with display names and actual font values
  const fontOptions = [
    { label: 'Sans Serif', value: 'system-ui, -apple-system, sans-serif', preview: 'Aa' },
    { label: 'Serif', value: 'Georgia, Merriweather, serif', preview: 'Aa' },
    { label: 'Monospace', value: 'JetBrains Mono, Consolas, monospace', preview: 'Aa' },
    { label: 'Arial', value: 'Arial, Helvetica, sans-serif', preview: 'Aa' },
    { label: 'Times New Roman', value: '"Times New Roman", Times, serif', preview: 'Aa' },
    { label: 'Courier New', value: '"Courier New", Courier, monospace', preview: 'Aa' },
    { label: 'Verdana', value: 'Verdana, Geneva, sans-serif', preview: 'Aa' },
    { label: 'Impact', value: 'Impact, Haettenschweiler, sans-serif', preview: 'Aa' },
    { label: 'Comic Sans MS', value: '"Comic Sans MS", cursive, sans-serif', preview: 'Aa' },
  ];

  // Handle PDF export
  const handleExportPDF = async () => {
    if (!editorRef.current || isExporting) return;

    setIsExporting(true);
    const fileName = (selectedPage?.title || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'document';

    try {
      await exportToPDF(editorRef.current, fileName);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Track fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Reset inline styles when exiting fullscreen
  useEffect(() => {
    if (!isFullscreen) {
      // Reset opacity for all toolbars when exiting fullscreen
      const topBar = document.querySelector('.fixed.top-0.left-0.h-18');
      const topRightBar = document.querySelector('.fixed.top-4.right-12');
      const rightToolbar = document.querySelector('.fixed.top-14.right-0');

      // Use requestAnimationFrame to ensure this runs after the state update and render
      requestAnimationFrame(() => {
        if (topBar) {
          topBar.style.opacity = '';
          topBar.style.visibility = '';
        }
        if (topRightBar) {
          topRightBar.style.opacity = '';
          topRightBar.style.visibility = '';
        }
        if (rightToolbar) {
          rightToolbar.style.opacity = '';
          rightToolbar.style.visibility = '';
        }
      });

      // Fallback: also reset after a short delay to catch any missed cases
      const timeoutId = setTimeout(() => {
        if (topBar) {
          topBar.style.opacity = '';
          topBar.style.visibility = '';
        }
        if (topRightBar) {
          topRightBar.style.opacity = '';
          topRightBar.style.visibility = '';
        }
        if (rightToolbar) {
          rightToolbar.style.opacity = '';
          rightToolbar.style.visibility = '';
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isFullscreen]);

  // Load pages from IndexedDB on app start
  useEffect(() => {
    async function loadPages() {
      const storedPages = await getAllPages();

      if (storedPages.length === 0) {
        const newPage = {
          id: crypto.randomUUID(),
          title: "Untitled",
          content: "",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        await addPage(newPage);
        setPages([newPage]);
        setSelectedPageId(newPage.id);
      } else {
         const cleanedPages = storedPages.map(page => ({
          ...page,
          title: page.title === "Untitled" ? "" : page.title
        }));
  // Sort the cleanedPages array
  cleanedPages.sort((a, b) => a.createdAt - b.createdAt);


        setPages(cleanedPages);
        setSelectedPageId(cleanedPages[0].id);
      }
    }

    loadPages();
  }, []);

  // Handle page selection
  const handleSelectedPage = (pageId) => {
    setSelectedPageId(pageId);
  };

  const selectedPage = pages.find(
    (page) => page.id === selectedPageId
  );

  const handleNewPage = async () => {
    const newPage = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // 1. Save to Dexie
    await addPage(newPage);

    // 2. Update React state
    setPages((prev) => [...prev, newPage]);

    // 3. Select new page switches user to added page
    setSelectedPageId(newPage.id);
  };

  const handleDeletePage = async (pageId) => {
    if (pages.length === 1) {
      // Clear the last page content and make it "new"
      const clearedPage = {
        title: '',
        content: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      await updatePage(pageId, clearedPage);
      setPages((prev) =>
        prev.map((p) =>
          p.id === pageId
            ? { ...p, ...clearedPage }
            : p
        )
      );
      setSelectedPageId(pageId);
      return;
    }

    await deletePage(pageId);

    setPages((prevPages) => {
      const updatedPages = prevPages.filter(
        (page) => page.id !== pageId
      );

      // Fix selection if needed
      if (pageId === selectedPageId) {
        setSelectedPageId(
          updatedPages.length > 0 ? updatedPages[0].id : null
        );
      }

      return updatedPages;
    });
  };

  const handleBodyChange = async (html) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === selectedPageId
          ? { ...p, content: html, updatedAt: Date.now() }
          : p
      )
    );

    await updatePage(selectedPageId, {
      content: html,
      updatedAt: Date.now(),
    });
  };

  const handleTitleChange = async (newTitle) => {
    if (!selectedPageId) return;

    setPages((prev) => {
      const page = prev.find(p => p.id === selectedPageId);
      if (!page) return prev;

      // Guard: same title → do nothing
      if (page.title === newTitle) return prev;

      return prev.map((p) =>
        p.id === selectedPageId
          ? { ...p, title: newTitle, updatedAt: Date.now() }
          : p
      );
    });

    // Persist to database
    await updatePage(selectedPageId, {
      title: newTitle,
      updatedAt: Date.now(),
    });
  };

  // Filter pages based on search query
  const filteredPages = useMemo(() => {
    if (!pageSearchQuery.trim()) return pages;
    const query = pageSearchQuery.toLowerCase();
    return pages.filter(page =>
      (page.title || "").toLowerCase().includes(query) ||
      contentContainsText(page.content, query)
    );
  }, [pages, pageSearchQuery]);

  // Find pages containing text search query
  const pagesWithTextMatches = useMemo(() => {
    if (!textSearchQuery.trim()) return [];
    const query = textSearchQuery.toLowerCase();
    return pages
      .filter(page => contentContainsText(page.content, query))
      .map(page => ({
        ...page,
        matchCount: countTextOccurrences(page.content, query)
      }));
  }, [pages, textSearchQuery]);

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)] dark:bg-[var(--color-paper)] transition-colors duration-500">
      <Sidebar
        pages={filteredPages}
        selectedPageId={selectedPageId}
        handleSelectedPage={handleSelectedPage}
        handleDeletePage={handleDeletePage}
        handleNewPage={handleNewPage}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        pageSearchQuery={pageSearchQuery}
        setPageSearchQuery={setPageSearchQuery}
        textSearchQuery={textSearchQuery}
        setTextSearchQuery={setTextSearchQuery}
        showTextSearch={showTextSearch}
        setShowTextSearch={setShowTextSearch}
        pagesWithTextMatches={pagesWithTextMatches}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden pb-16">
        {selectedPage && (
          <div className="flex-1 overflow-y-auto pt-2.5 pl-16">
            <Editor
              ref={editorRef}
              page={selectedPage}
              onContentChange={handleBodyChange}
              onTitleChange={handleTitleChange}
              onEditorReady={setBodyEditor}
            />
          </div>
        )}
      </div>

      {/* Top Bar - Add Button */}
      <div
        className={`fixed top-0 left-0 h-18 flex items-center px-4 gap-3 z-30 transition-all duration-300 ${
          isFullscreen ? 'opacity-0' : ''
        }`}
        onMouseEnter={(e) => {
          if (isFullscreen) {
            e.currentTarget.style.opacity = '1';
          } else {
            e.currentTarget.style.opacity = '';
          }
        }}
        onMouseLeave={(e) => {
          if (isFullscreen) {
            e.currentTarget.style.opacity = '0';
          } else {
            e.currentTarget.style.opacity = '';
          }
        }}
      >
        {/* Sidebar toggle */}
        <button
          className="p-2.5 text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors duration-300 cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Sidebar"
        >
          <PanelRightClose className={`transition-transform duration-300 ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} size={16} />
        </button>

        {/* New Page Button */}
        <button
          onClick={handleNewPage}
          className="flex items-center gap-2 px-4 py-2 text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] border border-dashed border-[var(--border-medium)] hover:border-[var(--color-accent)] transition-all duration-300"
        >
          <span className="text-xs font-medium uppercase tracking-widest">Add Document</span>
          <SquarePlus size={14} />
        </button>
      </div>

      {/* Top Right - Fullscreen Toggle */}
      <div
        className={`fixed top-4 right-12 flex items-center gap-2 z-30 transition-opacity duration-300 ${
          isFullscreen ? 'opacity-0' : ''
        }`}
        onMouseEnter={(e) => {
          if (isFullscreen) {
            e.currentTarget.style.opacity = '1';
          } else {
            e.currentTarget.style.opacity = '';
          }
        }}
        onMouseLeave={(e) => {
          if (isFullscreen) {
            e.currentTarget.style.opacity = '0';
          } else {
            e.currentTarget.style.opacity = '';
          }
        }}
      >
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          className="p-2.5 text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors duration-300 cursor-pointer"
          aria-label="Toggle Fullscreen"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Fullscreen Exit Button */}
      <button
        onClick={() => document.exitFullscreen()}
        className={`fixed top-4 right-12 z-30 p-2.5 text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-all duration-300 cursor-pointer ${
          isFullscreen ? '' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Exit Fullscreen"
      >
        <X size={18} />
      </button>

      {/* Right Toolbar - Tools (Aligned) */}
      <div
        className={`fixed top-14 right-0 flex flex-col items-center px-2 py-4 gap-3 z-30 transition-opacity duration-300 ${
          isFullscreen ? 'opacity-0' : ''
        }`}
        onMouseEnter={(e) => {
          if (isFullscreen) {
            e.currentTarget.style.opacity = '1';
          } else {
            e.currentTarget.style.opacity = '';
          }
        }}
        onMouseLeave={(e) => {
          if (isFullscreen) {
            e.currentTarget.style.opacity = '0';
          } else {
            e.currentTarget.style.opacity = '';
          }
        }}
      >
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors duration-300 cursor-pointer"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Font Style Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center gap-1 p-2.5 text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors duration-300"
            title="Font Style"
          >
            <Type size={18} />
          </button>
          {/* Dropdown menu */}
          <div className="absolute right-full top-0 mr-2 bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--border-light)] shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-40 z-50 max-h-64 overflow-y-auto">
            {fontOptions.map((font) => (
              <button
                key={font.value}
                onClick={() => setFontFamily(font.value)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--color-paper-dark)] dark:hover:bg-[var(--color-paper-darker)] transition-colors duration-200"
                style={{ fontFamily: font.value }}
              >
                {font.label}
              </button>
            ))}
            <button
              onClick={() => setFontFamily(null)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--color-paper-dark)] dark:hover:bg-[var(--color-paper-darker)] transition-colors duration-200 border-t border-[var(--border-light)]"
            >
              Default
            </button>
          </div>
        </div>

        {/* PDF Download */}
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="p-2.5 text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Export to PDF"
        >
          {isExporting ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <FileDown size={18} />
          )}
        </button>
      </div>

      {/* Stats - Bottom Right Corner */}
      <div
        className={`fixed bottom-4 right-4 flex flex-col items-end gap-1 z-30 transition-opacity duration-300 ${
          isFullscreen ? 'opacity-0' : ''
        }`}
        onMouseEnter={(e) => {
          if (isFullscreen) {
            e.currentTarget.style.opacity = '1';
          } else {
            e.currentTarget.style.opacity = '';
          }
        }}
        onMouseLeave={(e) => {
          if (isFullscreen) {
            e.currentTarget.style.opacity = '0';
          } else {
            e.currentTarget.style.opacity = '';
          }
        }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-paper-dark)] dark:bg-[var(--color-paper-darker)] border border-[var(--border-light)]">
          <Calculator size={14} className="text-[var(--color-ink-muted)]" />
          <span className="text-xs font-mono text-[var(--color-ink-muted)]">
            {selectedPage ? countWords(selectedPage.content) : 0} words
          </span>
          <span className="text-[var(--color-ink-muted)] opacity-40">|</span>
          <span className="text-xs font-mono text-[var(--color-ink-muted)]">
            {selectedPage ? calculateReadingTime(selectedPage.content) : 0} min read
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;