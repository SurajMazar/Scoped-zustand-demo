import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import FormDemo from './pages/FormDemo.tsx';
import FlowEditor from './pages/FlowEditor.tsx';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col w-full">
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-900">Advanced React Demo</h1>
            <div className="flex gap-4">
              <Link 
                to="/" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Form Demo
              </Link>
              <Link 
                to="/flow" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Flow Editor
              </Link>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Zustand + React Flow
          </div>
        </nav>

        <main className="flex-grow overflow-auto">
          <Routes>
            <Route path="/" element={<FormDemo />} />
            <Route path="/flow" element={<FlowEditor />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;