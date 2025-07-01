import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import ComponentsPanel from "@/components/form-builder/components-panel";
import FormCanvas from "@/components/form-builder/form-canvas";
import PropertiesPanel from "@/components/form-builder/properties-panel";
import type { FormField } from "@/types/form";

export default function FormBuilder() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [currentForm, setCurrentForm] = useState({
    id: null as number | null,
    title: "New Form",
    description: "Form description",
    fields: [] as FormField[],
    isActive: false,
  });
  
  const [selectedField, setSelectedField] = useState<FormField | null>(null);

  const { data: forms, isLoading } = useQuery({
    queryKey: ["/api/forms"],
  });

  const saveFormMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (currentForm.id) {
        return await apiRequest("PUT", `/api/forms/${currentForm.id}`, formData);
      } else {
        return await apiRequest("POST", "/api/forms", formData);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Form saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleFormMutation = useMutation({
    mutationFn: async (formId: number) => {
      return await apiRequest("POST", `/api/forms/${formId}/toggle`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Form status updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteFormMutation = useMutation({
    mutationFn: async (formId: number) => {
      return await apiRequest("DELETE", `/api/forms/${formId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Form deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveForm = () => {
    const formData = {
      title: currentForm.title,
      description: currentForm.description,
      fields: currentForm.fields,
      isActive: currentForm.isActive,
    };
    saveFormMutation.mutate(formData);
  };

  const handleLoadForm = (form: any) => {
    setCurrentForm({
      id: form.id,
      title: form.title,
      description: form.description || "",
      fields: form.fields || [],
      isActive: form.isActive,
    });
    setSelectedField(null);
  };

  const handleNewForm = () => {
    setCurrentForm({
      id: null,
      title: "New Form",
      description: "Form description",
      fields: [],
      isActive: false,
    });
    setSelectedField(null);
  };

  const handleAddField = (field: FormField) => {
    const newField = {
      ...field,
      id: `field_${Date.now()}`,
    };
    setCurrentForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    }));
  };

  const handleDeleteField = (fieldId: string) => {
    setCurrentForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId),
    }));
    setSelectedField(null);
  };

  const handlePublishForm = () => {
    const formData = {
      ...currentForm,
      isActive: true,
    };
    setCurrentForm(formData);
    saveFormMutation.mutate(formData);
  };

  if (user?.role !== 'admin') {
    return (
      <main className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
          <p className="text-slate-600">You need admin privileges to access the form builder.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Form Builder</h1>
          <p className="text-slate-600">Create and manage your forms</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleNewForm} variant="outline">
            <i className="fas fa-plus mr-2"></i>New Form
          </Button>
          <Button onClick={handleSaveForm} disabled={saveFormMutation.isPending}>
            <i className="fas fa-save mr-2"></i>
            {saveFormMutation.isPending ? "Saving..." : "Save"}
          </Button>
          <Button onClick={handlePublishForm} disabled={saveFormMutation.isPending}>
            <i className="fas fa-paper-plane mr-2"></i>Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Forms List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Your Forms</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-slate-500">Loading forms...</p>
            ) : forms?.length === 0 ? (
              <p className="text-slate-500">No forms created yet</p>
            ) : (
              <div className="space-y-2">
                {forms?.map((form: any) => (
                  <div
                    key={form.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-slate-50 ${
                      currentForm.id === form.id ? 'border-primary-500 bg-primary-50' : 'border-slate-200'
                    }`}
                    onClick={() => handleLoadForm(form)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm truncate">{form.title}</h4>
                      <Badge variant={form.isActive ? "default" : "secondary"} className="text-xs">
                        {form.isActive ? "Active" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{form.description}</p>
                    {user?.role === 'admin' && (
                      <div className="flex space-x-1 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFormMutation.mutate(form.id);
                          }}
                          className="h-6 px-2 text-xs"
                        >
                          {form.isActive ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure you want to delete this form?")) {
                              deleteFormMutation.mutate(form.id);
                            }
                          }}
                          className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Builder Interface */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* Components Panel */}
            <ComponentsPanel onAddField={handleAddField} />

            {/* Form Canvas */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="space-y-2">
                    <Input
                      value={currentForm.title}
                      onChange={(e) => setCurrentForm(prev => ({ ...prev, title: e.target.value }))}
                      className="text-xl font-bold border-none shadow-none p-0"
                      placeholder="Form Title"
                    />
                    <Textarea
                      value={currentForm.description}
                      onChange={(e) => setCurrentForm(prev => ({ ...prev, description: e.target.value }))}
                      className="border-none shadow-none p-0 resize-none"
                      placeholder="Form Description"
                      rows={2}
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <FormCanvas
                    fields={currentForm.fields}
                    selectedField={selectedField}
                    onSelectField={setSelectedField}
                    onUpdateField={handleUpdateField}
                    onDeleteField={handleDeleteField}
                    onAddField={handleAddField}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Properties Panel */}
            <PropertiesPanel
              selectedField={selectedField}
              onUpdateField={(updates) => {
                if (selectedField) {
                  handleUpdateField(selectedField.id, updates);
                  setSelectedField({ ...selectedField, ...updates });
                }
              }}
              onDeleteField={() => {
                if (selectedField) {
                  handleDeleteField(selectedField.id);
                }
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
