
import React, { createContext, useContext, useRef } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';
import { FormState, FieldMap } from '../types.ts';

// The type for our vanilla store API
export type FormStoreApi = StoreApi<FormState>;

interface CreateStoreOptions {
  initialFields?: FieldMap;
  onSetField?: (key: string, value: string) => void;
}

// Factory function updated to accept initial state and callbacks from props
export const createFormStore = (options: CreateStoreOptions = {}) => {
  const { initialFields, onSetField } = options;
  
  return createStore<FormState>((set) => ({
    fields: initialFields ? new Map(initialFields) : new Map<string, { value: string }>(),
    setField: (key, value) => {
      // Trigger the external callback if provided
      if (onSetField) {
        onSetField(key, value);
      }

      set((state) => {
        // Create a new Map instance for immutability to trigger React re-renders
        const newFields = new Map(state.fields);
        newFields.set(key, { value });
        return { fields: newFields };
      });
    },
  }));
};

// Create the context that will hold the store instance
const FormContext = createContext<FormStoreApi | null>(null);

interface FormProviderProps {
  children: React.ReactNode;
  initialValue?: FieldMap; // "value from props"
  onSetField?: (key: string, value: string) => void; // "setFunction from props"
}

export const FormProvider: React.FC<FormProviderProps> = ({ 
  children, 
  initialValue, 
  onSetField 
}) => {
  // Use useRef to ensure the store instance is created only once per provider lifecycle.
  // We pass the props into the factory here.
  const storeRef = useRef<FormStoreApi>(null);
  
  if (!storeRef.current) {
    storeRef.current = createFormStore({ 
      initialFields: initialValue, 
      onSetField 
    });
  }

  return (
    <FormContext.Provider value={storeRef.current}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to consume the scoped store from context
export function useFormContext<T>(
  selector: (state: FormState) => T
): T {
  const storeApi = useContext(FormContext);
  if (!storeApi) {
    throw new Error('useFormContext must be used within a FormProvider');
  }

  // useStore is used to "hook" into the vanilla store instance and trigger re-renders
  return useStore(storeApi, selector);
}
