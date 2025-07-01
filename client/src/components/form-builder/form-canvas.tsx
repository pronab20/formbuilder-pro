import { Button } from "@/components/ui/button";
import FieldComponent from "./field-components";
import type { FormField } from "@/types/form";

interface FormCanvasProps {
  fields: FormField[];
  selectedField: FormField | null;
  onSelectField: (field: FormField) => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onDeleteField: (fieldId: string) => void;
  onAddField: (field: FormField) => void;
}

export default function FormCanvas({ 
  fields, 
  selectedField, 
  onSelectField, 
  onUpdateField, 
  onDeleteField,
  onAddField 
}: FormCanvasProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData("application/json");
    if (fieldType) {
      const field = JSON.parse(fieldType);
      onAddField(field);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="space-y-4 min-h-96"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {fields.map((field) => (
        <div
          key={field.id}
          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
            selectedField?.id === field.id
              ? "border-primary-500 bg-primary-50"
              : "border-slate-200 hover:border-slate-300"
          }`}
          onClick={() => onSelectField(field)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">{field.label}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteField(field.id);
              }}
              className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
            >
              <i className="fas fa-trash text-xs"></i>
            </Button>
          </div>
          <FieldComponent
            field={field}
            isPreview={true}
            onChange={() => {}}
          />
          {field.required && (
            <span className="text-xs text-red-500 ml-1">*</span>
          )}
        </div>
      ))}

      {fields.length === 0 && (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-500">
          <i className="fas fa-plus-circle text-4xl text-slate-300 mb-2"></i>
          <p>Drop form components here</p>
          <p className="text-sm mt-1">or click on components from the left panel</p>
        </div>
      )}
    </div>
  );
}
