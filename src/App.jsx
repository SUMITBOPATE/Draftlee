// import { useState, useEffect } from "react";
// import Sidebar from "./components/Sidebar";
// import Editor from "./components/Editor/Editor";

// import {
//   getAllPages,
//   addPage,
//   updatePage,
//   deletePage,
// } from "./db/db";

// function App() {
//   const [pages, setPages] = useState([]);
//   const [selectedPageId, setSelectedPageId] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   // Load pages from IndexedDB on app start
// useEffect(() => {
//   async function loadPages() {
//     const storedPages = await getAllPages();

//     console.log("INIT DB pages:", storedPages);

//     if (storedPages.length === 0) {
//       const newPage = {
//         id: crypto.randomUUID(),
//         title: "",
//         content: "",
//         createdAt: Date.now(),
//         updatedAt: Date.now(),
//       };

//       await addPage(newPage);
//       setPages([newPage]);
//       setSelectedPageId(newPage.id);
//     } else {
//       setPages(storedPages);
//       setSelectedPageId(storedPages[0].id);
//     }
//   }

//   loadPages();
// }, []);





//   // Handle page selection
//   const handleSelectedPage = (pageId) => {
//     setSelectedPageId(pageId);
//   };

//   // Handle editor content change
//   const handleContentChange = async (newContent) => {
//     setPages((prevPages) =>
//       prevPages.map((page) =>
//         page.id === selectedPageId
//           ? {
//               ...page,
//               content: newContent,
//               updatedAt: Date.now(),
//             }
//           : page
//       )
//     );

//     await updatePage(selectedPageId, {
//       content: newContent,
//       updatedAt: Date.now(),
//     });
//   };

//   const selectedPage = pages.find(
//     (page) => page.id === selectedPageId
//   );
// const handleNewPage = async () => {
//   const newPage = {
//     id: crypto.randomUUID(),
//     title: ` `,
//     content: "",
//     createdAt: Date.now(),
//     updatedAt: Date.now(),
//   };

//   // 1. Save to Dexie
//   await addPage(newPage);

//   // 2. Update React state
//   setPages((prev) => [...prev, newPage]);

//   // 3. Select new page switches user to added pAGE
//   setSelectedPageId(newPage.id);
// };



// const handleDeletePage = async (pageId) => {
//   await deletePage(pageId);

//   setPages((prevPages) => {
//     const updatedPages = prevPages.filter(
//       (page) => page.id !== pageId
//     );

//     // Fix selection if needed
//     if (pageId === selectedPageId) {
//       setSelectedPageId(
//         updatedPages.length > 0 ? updatedPages[0].id : null
//       );
//     }

//     return updatedPages;
//   });
// };



//   const handleBodyChange = async (html) => {
//     setPages((prev) =>
//       prev.map((p) =>
//         p.id === selectedPageId
//           ? { ...p, content: html, updatedAt: Date.now() }
//           : p
//       )
//     );

//     await updatePage(selectedPageId, {
//       content: html,
//       updatedAt: Date.now(),
//     });
//   };

//  const handleTitleChange = (newTitle) => {
//   if (!selectedPageId) return;

//   setPages((prev) => {
//     const page = prev.find(p => p.id === selectedPageId);
//     if (!page) return prev;

//     // 🔒 Guard 1: same title → do nothing
//     if (page.title === newTitle) return prev;

//     return prev.map((p) =>
//       p.id === selectedPageId
//         ? { ...p, title: newTitle }
//         : p
//     );
//   });
// };









//   return (


//       <div className="flex min-h-screen  bg-[#fdfcfb]">
//           <Sidebar
//         pages={pages}
//         selectedPageId={selectedPageId}
//         handleSelectedPage={handleSelectedPage}
//         handleDeletePage={handleDeletePage}
//         isOpen={isSidebarOpen}
//         onClose={() => setIsSidebarOpen(false)}
//       />

//       <div className="flex-1 flex flex-col relative overflow-hidden pb-16">
//         {selectedPage && (
//           <div className="flex-1 overflow-y-auto pl-16 ">
//             <Editor
//               value={selectedPage.content}
//               onChange={handleContentChange}
//               page={selectedPage}
//               onContentChange={handleBodyChange}
//       onTitleChange={handleTitleChange}
//             />
//           </div>
//         )}
//       </div>

//       {/* Bottom Icon Bar - Minimal & Distraction-Free */}
//       <div 
//         className="fixed bottom-0 left-0 h-20 flex items-center px-4 gap-2 z-30 opacity-20 hover:opacity-100 transition-opacity duration-500 ease-out group"
//       >
//         {/* Sidebar toggle - hover to open */}
//         <button 
//           className="p-2.5 text-ink/40 hover:text-ink/70 hover:bg-ink/5 rounded-sm transition-all duration-200 ease-out cursor-pointer active:scale-95 active:opacity-70"
//           onMouseEnter={() => setIsSidebarOpen(true)}
//           aria-label="Toggle Sidebar"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="18"
//             height="18"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className={`transition-transform duration-400 ease-out ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`}
//           >
//             <rect width="18" height="18" x="3" y="3" rx="2"/>
//             <path d="M9 3v18"/>
//             <path d="m14 9 3 3-3 3"/>
//           </svg>
//         </button>

//         {/* New Page - Slightly more prominent */}
//         <button
//           onClick={handleNewPage}
//           className="p-2.5 text-ink/50 hover:text-ink/80 hover:bg-ink/8 rounded-sm transition-all duration-200 ease-out active:scale-95 active:opacity-70"
//           aria-label="New Page"
//         >
//           <svg 
//             xmlns="http://www.w3.org/2000/svg" 
//             width="18" 
//             height="18" 
//             viewBox="0 0 24 24" 
//             fill="none" 
//             stroke="currentColor" 
//             strokeWidth="1.75" 
//             strokeLinecap="round" 
//             strokeLinejoin="round"
//           >
//             <path d="M5 12h14"/>
//             <path d="M12 5v14"/>
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// }

// export default App;
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor/Editor";
import { PanelRightClose, SquarePlus, Moon, Sun } from "lucide-react";
import { useDarkMode } from "./contexts/DarkModeContext";
import {
  getAllPages,
  addPage,
  updatePage,
  deletePage,
} from "./db/db";


function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load pages from IndexedDB on app start
  useEffect(() => {
    async function loadPages() {
      const storedPages = await getAllPages();

      console.log("INIT DB pages:", storedPages);

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
    
if(pages.length==1) return;
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

  return (
    <div className="flex min-h-screen bg-[#fdfcfb] dark:bg-[#1a1613] transition-colors duration-300">
      <Sidebar
        pages={pages}
        selectedPageId={selectedPageId}
        handleSelectedPage={handleSelectedPage}
        handleDeletePage={handleDeletePage}
        handleNewPage={handleNewPage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden pb-16">
        {selectedPage && (
          <div className="flex-1 overflow-y-auto pt-2.5 pl-16">
            <Editor
              page={selectedPage}
              onContentChange={handleBodyChange}
              onTitleChange={handleTitleChange}
            />
          </div>
        )}
      </div>

      {/* Top Icon Bar - Minimal & Distraction-Free */}
      <div 
        className="fixed top-0 left-0 h-18 flex items-center px-4 gap-2 z-30 opacity-20 hover:opacity-100 transition-opacity duration-500 ease-out group"
      >
        {/* Sidebar toggle - hover to open */}
        <button 
          className="p-2.5 text-ink/40 dark:text-gray-400 hover:text-ink/70 dark:hover:text-gray-200 hover:bg-ink/5 dark:hover:bg-white/5 rounded-sm transition-all duration-200 ease-out cursor-pointer active:scale-95 active:opacity-70"
          onMouseEnter={() => setIsSidebarOpen(true)}
          aria-label="Toggle Sidebar"
        >
          <PanelRightClose className={`transition-transform duration-400 ease-out ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} size={16} />
        </button>

        {/* New Page Button */}
        <button
          onClick={handleNewPage}
          className="flex items-center justify-between w-full px-3 py-2 text-[#8b7355]/70 dark:text-[#c5a059]/70 hover:text-[#8b7355] dark:hover:text-[#c5a059] hover:bg-[#e5e0d8]/50 dark:hover:bg-white/5 rounded-lg border border-dashed border-[#8b7355]/30 dark:border-[#c5a059]/30 transition-all group"
        >
          <span className="text-xs font-semibold uppercase tracking-wider">Add Document</span>
          <SquarePlus size={16} />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 text-ink/40 dark:text-gray-400 hover:text-ink/70 dark:hover:text-gray-200 hover:bg-ink/5 dark:hover:bg-white/5 rounded-sm transition-all duration-200 ease-out cursor-pointer active:scale-95 active:opacity-70"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );
}

export default App;