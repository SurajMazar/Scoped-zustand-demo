
import React, { createContext, useContext, useRef } from 'react';
import { createStore, StoreApi } from 'zustand';
import { useStore } from 'zustand';
import { FormState, FieldMap } from '../types';

// The type for our vanilla store API
export type FormStoreApi = StoreApi<FormState>;

// Factory function to create a new vanilla store instance
export const createFormStore = () => {
  return createStore<FormState>((set) => ({
    fields: new Map<string, { value: string }>(),
    setField: (key, value) => 
      set((state) => {
        // Create a new Map instance for immutability to trigger React re-renders
        const newFields = new Map(state.fields);
        newFields.set(key, { value });
        return { fields: newFields };
      }),
  }));
};

// Create the context that will hold the store instance
const FormContext = createContext<FormStoreApi | null>(null);

interface FormProviderProps {
  children: React.ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  // Use useRef to ensure the store instance is created only once per provider lifecycle
  const storeRef = useRef<FormStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createFormStore();
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
