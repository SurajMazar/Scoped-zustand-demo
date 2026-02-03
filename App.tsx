
import React from 'react';
import { FormProvider } from './store/FormStore.tsx';
import NameComponent from './components/NameComponent.tsx';
import PasswordComponent from './components/PasswordComponent.tsx';
import DebugView from './components/DebugView.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-100 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scoped Zustand Demo</h1>
          <p className="text-slate-500 text-sm mt-1">
            Using Context-based Stores with Immutable Maps.
          </p>
        </header>

        {/* 
            The FormProvider encapsulates a unique instance of the Zustand store.
            This ensures that different parts of the app can have separate store 
            lifecycles if needed, rather than sharing a global singleton.
        */}
        <FormProvider>
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
              <NameComponent />
              <PasswordComponent />
            </div>
            
            <DebugView />
          </div>
        </FormProvider>

        <footer className="mt-8 text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            Pattern: Factory + Context + useStore
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
