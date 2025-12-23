

import React from 'react';
import  getTimeAgo from '../utils/time';
import { Timer,Trash2 } from 'lucide-react';


function Sidebar({  pages,selectedPageId,handleSelectedPage,  handleDeletePage,  isOpen,  onClose,}) {
  

  
  
  return (
       <>
      <aside 
        className={`fixed top-0 left-0 h-full bg-[#EDEDED] border-r border-[#e5e0d8] p-5 pb-10 flex flex-col z-1 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full'
        } w-64`}
        onMouseLeave={onClose}
      >
        {/* Brand Header */}
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-serif italic text-[#3d3530] tracking-tight">
            Draftlee
          </h1>
          <p className="text-[9px] text-[#8b7355] font-bold tracking-[0.2em] uppercase opacity-60 mt-1">
            Studio Editor
          </p>
        </div>

        {/* Documents List */}
        <div className="flex-1 overflow-hidden flex flex-col mb-12">
          <div className="flex items-center justify-between mb-4 px-2 opacity-50">
            <span className="text-[10px] font-bold text-[#8b7355] tracking-widest uppercase">
              Documents
            </span>
            <span className="text-[10px] font-mono italic">{pages?.length || 0}</span>
          </div>
          
          <ul className="space-y-1 overflow-y-auto pr-2 flex-1 custom-scrollbar">
            {pages?.map((page) => (
              <li
                key={page.id}
                onClick={() => handleSelectedPage(page.id)}
                className={`group cursor-pointer px-3 py-3 rounded-lg transition-colors duration-150 flex items-center justify-between
                  ${
                    page.id === selectedPageId
                      ? "bg-[#e5e5e5] text-[#1a1613]"
                      : "hover:bg-[#e5e5e5] text-[#5c544e]"
                  }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* Active indicator dot */}
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    page.id === selectedPageId ? 'bg-[#c5a059]' : 'bg-transparent'
                  }`} />
                  
                  <div className="flex flex-col gap-1">
  {/* Title */}
  <span
  className={`text-sm truncate ${
    page.title?.trim()
      ? "text-gray-800 font-normal"
      : "text-gray-400 font-normal opacity-80"
  }`}
>
  {page.title?.trim() || "Untitled"}
</span>

  {/* Time row */}
  <span className="flex items-center gap-1 text-xs text-gray-400">
    <Timer strokeWidth={1.5} size={16} />
   

    <span>{getTimeAgo(page.createdAt)}</span>
  </span>
</div>

                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePage(page.id);
                  }}
                  className="p-1 text-[#8b7355]/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                 
                    <Trash2 strokeWidth={1.5} size={16} />
                
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Minimal Footer */}
        {/* <div className=" border-t border-[#e5e0d8] opacity-40 text-center">
          <p className="text-[9px] tracking-widest uppercase font-medium mb-12">Focus Mode Active</p>
        </div> */}
      </aside>
{/* 
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Instrument+Serif:italic&display=swap');

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e0d8;
          border-radius: 10px;
        }
        
        aside {
          font-family: 'Inter', sans-serif;
        }
        
        h1 {
          font-family: 'Instrument Serif', serif;
        }
      `}</style> */}
    </>
  );
}

export default Sidebar;