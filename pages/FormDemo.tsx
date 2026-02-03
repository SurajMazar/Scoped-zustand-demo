
import React, { useMemo } from 'react';
import { FormProvider } from '../store/FormStore.tsx';
import NameComponent from '../components/NameComponent.tsx';
import PasswordComponent from '../components/PasswordComponent.tsx';
import DebugView from '../components/DebugView.tsx';
import { FieldMap } from '../types.ts';

const FormDemo: React.FC = () => {
  const initialData: FieldMap = useMemo(() => {
    const m = new Map();
    m.set('username', { value: 'admin_user' });
    m.set('password', { value: 'secret123' });
    return m;
  }, []);

  const handleFieldUpdate = (key: string, value: string) => {
    console.log(`[Parent Notification] Field "${key}" updated to: "${value}"`);
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-100 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scoped Zustand Demo</h1>
          <p className="text-slate-500 text-sm mt-1">
            Initialized with props & external callbacks.
          </p>
        </header>

        <FormProvider 
          initialValue={initialData} 
          onSetField={handleFieldUpdate}
        >
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
              <NameComponent />
              <PasswordComponent />
            </div>
            
            <DebugView />
          </div>
        </FormProvider>
      </div>
    </div>
  );
};

export default FormDemo;
