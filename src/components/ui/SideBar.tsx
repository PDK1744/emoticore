import React, { useState } from "react";
import { Bot, Plus, Trash2 } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
  sessions: { id: string; title?: string; updated_at?: string }[];
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void; // <-- Add this prop
  activeSessionId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  onNewChat,
  sessions,
  onSelectSession,
  onDeleteSession,
  activeSessionId,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    sessionId: string | null;
  }>({ x: 0, y: 0, sessionId: null });

  // Close context menu on click elsewhere
  React.useEffect(() => {
    const close = () => setContextMenu({ x: 0, y: 0, sessionId: null });
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-30 transition-opacity md:hidden ${
          open ? "block" : "hidden"
        }`}
        onClick={onClose}
      />
      <aside
        className={`
          fixed z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block
        `}
        style={{ minWidth: 240 }}
      >
        <div className="flex items-center space-x-3 px-4 py-4 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">EmotiCore</span>
        </div>
        <div className="px-4 py-3 border-b border-gray-100">
          <button
            className="flex items-center w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={onNewChat}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </button>
        </div>
        <div className="px-2 py-2 overflow-y-auto flex-1">
          <div className="text-xs text-gray-500 px-2 mb-2">Previous Chats</div>
          {sessions.length === 0 && (
            <div className="text-gray-400 text-sm px-2 py-2">No chats yet.</div>
          )}
          <ul>
            {sessions.map((s) => (
              <li key={s.id} className="relative">
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition ${
                    s.id === activeSessionId
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-blue-100 text-black"
                  }`}
                  onClick={() => {
                    onSelectSession(s.id);
                    onClose();
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setContextMenu({
                      x: rect.left,
                      y: rect.bottom,
                      sessionId: s.id,
                    });
                  }}
                >
                  {s.title || "Untitled Chat"}
                  {s.updated_at && (
                    <span className="block text-xs text-gray-400">
                      {new Date(s.updated_at).toLocaleString()}
                    </span>
                  )}
                </button>
                {/* Context Menu */}
                {contextMenu.sessionId === s.id && (
                  <div
                    className="fixed z-50 bg-white border rounded shadow-lg py-1"
                    style={{
                      top: contextMenu.y,
                      left: contextMenu.x,
                      minWidth: 120,
                    }}
                  >
                    <button
                      className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        onDeleteSession(s.id);
                        setContextMenu({ x: 0, y: 0, sessionId: null });
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
