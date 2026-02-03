
import React from 'react';
import { useFormContext } from '../store/FormStore.tsx';

const NameComponent: React.FC = () => {
  // Select only the pieces of state this component needs
  const username = useFormContext((state) => state.fields.get('username')?.value || '');
  const setField = useFormContext((state) => state.setField);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="username" className="text-sm font-semibold text-slate-700">
        Username
      </label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setField('username', e.target.value)}
        placeholder="Enter username"
        className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
      />
    </div>
  );
};

export default NameComponent;
