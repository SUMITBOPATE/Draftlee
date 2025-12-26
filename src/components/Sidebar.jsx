

import getTimeAgo from '../utils/time';
import { Clock } from 'lucide-react'; // Added Plus and Settings for the top nav
import DeleteIcon from './DeleteIcon';
function Sidebar({ 
  pages, 
  selectedPageId, 
  handleSelectedPage, 
  handleDeletePage, 
  isOpen, 
  onClose 
}) {
  
  // Placeholder function for adding a page (since it wasn't passed in props)
  

  return (
    <>
    
      <aside 
        className={`fixed top-0 left-0 h-full inset-0 bg-[#EDEDED] dark:bg-[#2a2520] border-r border-[#e5e0d8] dark:border-[#3d3530] flex flex-col z-10 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0.1 shadow-lg' : '-translate-x-full'
        } w-64`}
        onMouseLeave={onClose}
      >
        
 
       

        {/* --- MIDDLE SECTION: Scrollable Documents List --- */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 pt-16 px-2">
          
          {/* List Header */}
          <div className="flex-none flex items-center justify-between mb-2 px-2 opacity-50">
            <span className="text-[10px] font-bold text-[#4d4945] dark:text-[#a89881] tracking-widest uppercase">
              Documents
            </span>
            <span className="text-[10px] font-mono dark:text-[#a89881]">{pages?.length || 0}</span>
          </div>
          
          {/* Scrollable List */}
          <ul className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1 pb-4">
            {pages?.map((page) => (
              <li
                key={page.id}
                onClick={() => handleSelectedPage(page.id)}
                className={`group cursor-pointer px-3 py-3 rounded-lg transition-colors duration-150 flex items-center justify-between
                  ${
                    page.id === selectedPageId
                      ? "bg-[#e5e5e5] dark:bg-[#3d3530] text-[#1a1613] dark:text-[#e8e6e1]"
                      : "hover:bg-[#e5e5e5] dark:hover:bg-[#3d3530] text-[#5c544e] dark:text-[#a89881]"
                  }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* Active indicator dot */}
                  <div className={`w-1.5 h-1.5 shrink-0 rounded-full transition-colors ${
                    page.id === selectedPageId ? 'bg-[#c5a059] dark:bg-[#d4b068]' : 'bg-transparent'
                  }`} />
                  
                  <div className="flex flex-col text-9xl gap-0.5 overflow-hidden">
                    {/* Title */}
                    <span
                      className={`text-sm truncate block ${
                        page.title?.trim()
                          ? "text-gray-800 dark:text-gray-200 font-normal font-sans"
                          : "text-gray-400 dark:text-gray-500 font-normal font-sans opacity-80"
                      }`}
                    >
                      {page.title?.trim() || "Untitled"}
                    </span>

                    {/* Time row */}
                    <span className="flex items-center font-sans gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                      <Clock strokeWidth={1.5} size={12} />
                      <span className="truncate">{getTimeAgo(page.createdAt)}</span>
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePage(page.id);
                  }}
                  className="p-1.5 text-[#8b7355]/40 dark:text-[#c5a059]/40 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <DeleteIcon size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* --- BOTTOM SECTION: Branding --- */}
        <div className="flex-none p-5 pt-4 border-t border-[#e5e0d8]/50 dark:border-[#3d3530]/50 bg-[#EDEDED] dark:bg-[#2a2520]">
           <h1 className="text-xl font-serif italic text-[#3d3530] dark:text-[#d4b068] tracking-tight">
             Draftlee
           </h1>
           <p className="text-[9px] text-[#8b7355] dark:text-[#c5a059] font-bold tracking-[0.2em] uppercase opacity-60 mt-0.5">
             Your writing companion
           </p>
        </div>
       
      </aside>
      
    </>
  );
}

export default Sidebar;
