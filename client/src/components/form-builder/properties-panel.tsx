import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormField } from "@/types/form";

interface PropertiesPanelProps {
  selectedField: FormField | null;
  onUpdateField: (updates: Partial<FormField>) => void;
  onDeleteField: () => void;
}

export default function PropertiesPanel({ selectedField, onUpdateField, onDeleteField }: PropertiesPanelProps) {
  if (!selectedField) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Field Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-8">
            Select a field to edit its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleOptionsChange = (value: string) => {
    const options = value.split('\n').filter(opt => opt.trim());
    onUpdateField({ options });
  };

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle>Field Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="field-label">Field Label</Label>
          <Input
            id="field-label"
            value={selectedField.label}
            onChange={(e) => onUpdateField({ label: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="field-placeholder">Placeholder Text</Label>
          <Input
            id="field-placeholder"
            value={selectedField.placeholder || ""}
            onChange={(e) => onUpdateField({ placeholder: e.target.value })}
          />
        </div>

        {selectedField.type !== "checkbox" && (
          <div>
            <Label htmlFor="field-help">Help Text</Label>
            <Textarea
              id="field-help"
              value={selectedField.helpText || ""}
              onChange={(e) => onUpdateField({ helpText: e.target.value })}
              rows={2}
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="field-required"
            checked={selectedField.required}
            onCheckedChange={(checked) => onUpdateField({ required: checked as boolean })}
          />
          <Label htmlFor="field-required">Required field</Label>
        </div>

        {(selectedField.type === "select" || selectedField.type === "radio" || selectedField.type === "checkbox") && (
          <div>
            <Label htmlFor="field-options">Options (one per line)</Label>
            <Textarea
              id="field-options"
              value={selectedField.options?.join('\n') || ""}
              onChange={(e) => handleOptionsChange(e.target.value)}
              rows={4}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
            />
          </div>
        )}

        {selectedField.type === "number" && (
          <>
            <div>
              <Label htmlFor="field-min">Minimum Value</Label>
              <Input
                id="field-min"
                type="number"
                value={selectedField.min || ""}
                onChange={(e) => onUpdateField({ min: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
            <div>
              <Label htmlFor="field-max">Maximum Value</Label>
              <Input
                id="field-max"
                type="number"
                value={selectedField.max || ""}
                onChange={(e) => onUpdateField({ max: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
          </>
        )}

        {selectedField.type === "currency" && (
          <div>
            <Label htmlFor="field-min">Minimum Amount</Label>
            <Input
              id="field-min"
              type="number"
              value={selectedField.min || ""}
              onChange={(e) => onUpdateField({ min: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="100"
            />
          </div>
        )}

        <div className="border-t border-slate-200 pt-4">
          <Button
            onClick={onDeleteField}
            variant="destructive"
            className="w-full"
          >
            <i className="fas fa-trash mr-2"></i>Delete Field
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
