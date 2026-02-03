
import React from 'react';
import { useFormContext } from '../store/FormStore';

const PasswordComponent: React.FC = () => {
  const password = useFormContext((state) => state.fields.get('password')?.value || '');
  const setField = useFormContext((state) => state.setField);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="password" className="text-sm font-semibold text-slate-700">
        Password
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setField('password', e.target.value)}
        placeholder="••••••••"
        className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
      />
    </div>
  );
};

export default PasswordComponent;
