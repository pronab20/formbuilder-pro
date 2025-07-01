import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import FieldComponent from "./form-builder/field-components";
import type { FormField } from "@/types/form";

interface UserFormProps {
  form: any;
  onSubmit?: () => void;
}

export default function UserForm({ form, onSubmit }: UserFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerSearch, setCustomerSearch] = useState("");

  const { data: customers } = useQuery({
    queryKey: ["/api/customers/search", customerSearch],
    enabled: customerSearch.length > 2,
  });

  const submitFormMutation = useMutation({
    mutationFn: async (submissionData: any) => {
      return await apiRequest("POST", "/api/submissions", submissionData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Form submitted successfully",
      });
      setFormData({});
      setSelectedCustomer(null);
      setCustomerSearch("");
      onSubmit?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const missingFields = form.fields
      .filter((field: FormField) => field.required && !formData[field.id])
      .map((field: FormField) => field.label);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in required fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Validate collection plan minimum
    const collectionPlan = formData.collection_plan || formData.collectionPlan;
    if (collectionPlan && Number(collectionPlan) < 100) {
      toast({
        title: "Validation Error",
        description: "Collection plan must be at least ₹100",
        variant: "destructive",
      });
      return;
    }

    const submissionData = {
      formId: form.id,
      customerId: selectedCustomer?.id,
      data: formData,
      collectionPlan: collectionPlan ? Number(collectionPlan) : null,
      waterPlan: formData.water_plan || formData.waterPlan ? Number(formData.water_plan || formData.waterPlan) : null,
    };

    submitFormMutation.mutate(submissionData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.title}</CardTitle>
        {form.description && (
          <p className="text-slate-600">{form.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auto-filled user fields */}
          <div className="border-l-4 border-blue-400 pl-4 bg-blue-50 rounded-r-lg p-4">
            <Label className="block text-sm font-medium text-slate-700 mb-2">
              User Name (Auto-filled)
            </Label>
            <Input
              value={`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email || ""}
              readOnly
              className="bg-slate-100"
            />
            <p className="text-xs text-slate-500 mt-1">This field is automatically filled</p>
          </div>

          <div className="border-l-4 border-blue-400 pl-4 bg-blue-50 rounded-r-lg p-4">
            <Label className="block text-sm font-medium text-slate-700 mb-2">
              User ID (Auto-filled)
            </Label>
            <Input
              value={user?.id || ""}
              readOnly
              className="bg-slate-100"
            />
            <p className="text-xs text-slate-500 mt-1">This field is automatically filled and cannot be changed</p>
          </div>

          {/* Customer Selection */}
          <div>
            <Label className="block text-sm font-medium text-slate-700 mb-2">
              Customer Selection <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                placeholder="Type to search customers..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
              />
              {customers && customers.length > 0 && customerSearch.length > 2 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {customers.map((customer: any) => (
                    <div
                      key={customer.id}
                      className="p-2 hover:bg-slate-100 cursor-pointer"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setCustomerSearch(customer.name);
                      }}
                    >
                      <div className="font-medium">{customer.name}</div>
                      {customer.email && (
                        <div className="text-sm text-slate-500">{customer.email}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedCustomer && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {selectedCustomer.name}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">Search and select existing customer from database</p>
          </div>

          {/* Collection Plan */}
          <div>
            <Label className="block text-sm font-medium text-slate-700 mb-2">
              Collection Plan (Rupees) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-500">₹</span>
              <Input
                type="number"
                className="pl-8"
                placeholder="Minimum 100"
                min="100"
                required
                value={formData.collectionPlan || ""}
                onChange={(e) => handleFieldChange("collectionPlan", e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Minimum amount: ₹100</p>
          </div>

          {/* Water Plan */}
          <div>
            <Label className="block text-sm font-medium text-slate-700 mb-2">
              Water Plan (Physical Cases)
            </Label>
            <Input
              type="number"
              placeholder="Number of cases"
              value={formData.waterPlan || ""}
              onChange={(e) => handleFieldChange("waterPlan", e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">Optional field</p>
          </div>

          {/* Dynamic form fields */}
          {form.fields?.map((field: FormField) => (
            <div key={field.id}>
              <Label className="block text-sm font-medium text-slate-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <FieldComponent
                field={field}
                value={formData[field.id]}
                onChange={(value) => handleFieldChange(field.id, value)}
              />
              {field.helpText && (
                <p className="text-xs text-slate-500 mt-1">{field.helpText}</p>
              )}
            </div>
          ))}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={submitFormMutation.isPending}
          >
            {submitFormMutation.isPending ? "Submitting..." : "Submit Form"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
