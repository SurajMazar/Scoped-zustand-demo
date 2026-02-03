
import React from 'react';
import { useFormContext } from '../store/FormStore';

const DebugView: React.FC = () => {
  const fields = useFormContext((state) => state.fields);

  // Convert Map to a plain object for JSON serialization display
  const fieldsObject = Object.fromEntries(fields);

  return (
    <div className="mt-8 p-4 bg-slate-800 rounded-lg shadow-inner overflow-hidden">
      <h3 className="text-blue-400 font-mono text-xs uppercase tracking-wider mb-2">
        Store Debug State (JS Map Instance)
      </h3>
      <pre className="text-emerald-400 font-mono text-sm overflow-auto whitespace-pre-wrap">
        {JSON.stringify(fieldsObject, null, 2)}
      </pre>
      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-slate-400 text-xs">
          Map Size: <span className="text-white font-bold">{fields.size}</span>
        </p>
      </div>
    </div>
  );
};

export default DebugView;
