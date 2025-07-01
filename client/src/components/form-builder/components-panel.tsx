import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FormField } from "@/types/form";

interface ComponentsPanelProps {
  onAddField: (field: FormField) => void;
}

export default function ComponentsPanel({ onAddField }: ComponentsPanelProps) {
  const fieldTypes = [
    { type: "text", icon: "fas fa-align-left", label: "Single Line Text", description: "Short text input" },
    { type: "textarea", icon: "fas fa-align-justify", label: "Multi Line Text", description: "Paragraph text area" },
    { type: "number", icon: "fas fa-hashtag", label: "Number", description: "Numerical input" },
    { type: "email", icon: "fas fa-envelope", label: "Email", description: "Email address input" },
    { type: "phone", icon: "fas fa-phone", label: "Phone", description: "Phone number input" },
    { type: "date", icon: "fas fa-calendar", label: "Date", description: "Date picker" },
    { type: "datetime", icon: "fas fa-clock", label: "Date/Time", description: "Date and time picker" },
    { type: "select", icon: "fas fa-chevron-down", label: "Dropdown", description: "Select from options" },
    { type: "radio", icon: "fas fa-dot-circle", label: "Radio Buttons", description: "Single choice selection" },
    { type: "checkbox", icon: "fas fa-check-square", label: "Checkboxes", description: "Multiple choice selection" },
    { type: "file", icon: "fas fa-upload", label: "File Upload", description: "File attachment" },
    { type: "currency", icon: "fas fa-rupee-sign", label: "Currency", description: "Monetary value input" },
    { type: "location", icon: "fas fa-map-marker-alt", label: "Location/Map", description: "Address and map selection" },
  ];

  const handleAddField = (type: string, label: string) => {
    const field: FormField = {
      id: `field_${Date.now()}`,
      type,
      label,
      placeholder: `Enter ${label.toLowerCase()}`,
      required: false,
      options: type === "select" || type === "radio" || type === "checkbox" ? ["Option 1", "Option 2"] : undefined,
    };
    onAddField(field);
  };

  const inputFields = fieldTypes.slice(0, 7);
  const selectionFields = fieldTypes.slice(7, 10);
  const advancedFields = fieldTypes.slice(10);

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle>Form Components</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Input Fields</h4>
          <div className="space-y-2">
            {inputFields.map((field) => (
              <div
                key={field.type}
                className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-3 cursor-pointer hover:border-primary-400 transition-colors"
                onClick={() => handleAddField(field.type, field.label)}
              >
                <div className="flex items-center space-x-2">
                  <i className={`${field.icon} text-slate-600`}></i>
                  <span className="text-sm font-medium">{field.label}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{field.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Selection Fields</h4>
          <div className="space-y-2">
            {selectionFields.map((field) => (
              <div
                key={field.type}
                className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-3 cursor-pointer hover:border-primary-400 transition-colors"
                onClick={() => handleAddField(field.type, field.label)}
              >
                <div className="flex items-center space-x-2">
                  <i className={`${field.icon} text-slate-600`}></i>
                  <span className="text-sm font-medium">{field.label}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{field.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Advanced Fields</h4>
          <div className="space-y-2">
            {advancedFields.map((field) => (
              <div
                key={field.type}
                className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-3 cursor-pointer hover:border-primary-400 transition-colors"
                onClick={() => handleAddField(field.type, field.label)}
              >
                <div className="flex items-center space-x-2">
                  <i className={`${field.icon} text-slate-600`}></i>
                  <span className="text-sm font-medium">{field.label}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{field.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
