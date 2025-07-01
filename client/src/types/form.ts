export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  helpText?: string;
  min?: number;
  max?: number;
}

export interface FormData {
  id?: number;
  title: string;
  description?: string;
  fields: FormField[];
  isActive: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormSubmission {
  id: number;
  formId: number;
  userId: string;
  customerId?: number;
  data: Record<string, any>;
  collectionPlan?: number;
  waterPlan?: number;
  submittedAt: string;
}
