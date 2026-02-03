
export interface FieldValue {
  value: string;
}

export type FieldMap = Map<string, FieldValue>;

export interface FormState {
  fields: FieldMap;
  setField: (key: string, value: string) => void;
}
