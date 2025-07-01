import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { FormField } from "@/types/form";

interface FieldComponentProps {
  field: FormField;
  value?: any;
  onChange: (value: any) => void;
  isPreview?: boolean;
}

export default function FieldComponent({ field, value, onChange, isPreview = false }: FieldComponentProps) {
  const baseProps = {
    placeholder: field.placeholder,
    required: field.required,
    disabled: isPreview,
  };

  switch (field.type) {
    case "text":
      return (
        <Input
          {...baseProps}
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "textarea":
      return (
        <Textarea
          {...baseProps}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      );

    case "number":
      return (
        <Input
          {...baseProps}
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          min={field.min}
          max={field.max}
        />
      );

    case "email":
      return (
        <Input
          {...baseProps}
          type="email"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "phone":
      return (
        <Input
          {...baseProps}
          type="tel"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "date":
      return (
        <Input
          {...baseProps}
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "datetime":
      return (
        <Input
          {...baseProps}
          type="datetime-local"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "currency":
      return (
        <div className="relative">
          <span className="absolute left-3 top-3 text-slate-500">₹</span>
          <Input
            {...baseProps}
            type="number"
            className="pl-8"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            min={field.min || 100}
          />
        </div>
      );

    case "select":
      return (
        <Select value={value || ""} onValueChange={onChange} disabled={isPreview}>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "radio":
      return (
        <RadioGroup value={value || ""} onValueChange={onChange} disabled={isPreview}>
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${field.id}-${index}`} />
              <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      );

    case "checkbox":
      if (field.options && field.options.length > 1) {
        // Multiple checkboxes
        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (checked) {
                      onChange([...currentValues, option]);
                    } else {
                      onChange(currentValues.filter((v: string) => v !== option));
                    }
                  }}
                  disabled={isPreview}
                />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      } else {
        // Single checkbox
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value || false}
              onCheckedChange={onChange}
              disabled={isPreview}
            />
            <Label htmlFor={field.id}>{field.options?.[0] || field.label}</Label>
          </div>
        );
      }

    case "file":
      return (
        <Input
          {...baseProps}
          type="file"
          onChange={(e) => onChange(e.target.files?.[0])}
        />
      );

    case "location":
      return (
        <div className="space-y-2">
          <Input
            {...baseProps}
            type="text"
            placeholder="Enter address"
            value={value?.address || ""}
            onChange={(e) => onChange({ ...value, address: e.target.value })}
          />
          <div className="h-32 bg-slate-100 rounded border flex items-center justify-center text-slate-500">
            <i className="fas fa-map-marker-alt mr-2"></i>
            Map placeholder
          </div>
        </div>
      );

    default:
      return (
        <Input
          {...baseProps}
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}
