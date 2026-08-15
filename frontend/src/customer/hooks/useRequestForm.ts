// ---------------------------------------------------------------------------
// useRequestForm
// ---------------------------------------------------------------------------
// Owns all state for the "place an order" form and exposes a type-safe
// field updater. Lifting the state out of RequestForm keeps the field
// components small and purely presentational.
// ---------------------------------------------------------------------------

import { useState } from 'react';

/** All editable fields in the order form. */
export interface RequestFormState {
  portions: number;
  /** 0-3 → Mild, Medium, Hot, Extra Hot */
  spiceLevel: number;
  dietary: string;
  customizations: string;
  date: string;
  time: string;
  budget: number;
}

const INITIAL_STATE: RequestFormState = {
  portions: 1,
  spiceLevel: 1,
  dietary: '',
  customizations: '',
  date: '',
  time: '',
  budget: 500,
};

export function useRequestForm() {
  const [formData, setFormData] = useState<RequestFormState>(INITIAL_STATE);

  /** Update a single field, e.g. setField('portions', 3). */
  const setField = <K extends keyof RequestFormState>(key: K, value: RequestFormState[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  return { formData, setField };
}
