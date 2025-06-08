import type { ConditionalFormattingTemplate } from "metabase-types/api";

const STORAGE_KEY = "metabase_conditional_formatting_templates";

export const loadTemplates = (): ConditionalFormattingTemplate[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error loading templates:", e);
    return [];
  }
};

export const saveTemplate = (
  template: Omit<ConditionalFormattingTemplate, "id">,
): ConditionalFormattingTemplate => {
  const templates = loadTemplates();
  const newTemplate = {
    ...template,
    id: Date.now(), // Use timestamp as a simple unique ID
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  templates.push(newTemplate);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  return newTemplate;
};

export const updateTemplate = (
  template: ConditionalFormattingTemplate,
): ConditionalFormattingTemplate => {
  const templates = loadTemplates();
  const index = templates.findIndex((t) => t.id === template.id);

  if (index === -1) {
    throw new Error(`Template with id ${template.id} not found`);
  }

  const updatedTemplate = {
    ...template,
    updated_at: new Date().toISOString(),
  };

  templates[index] = updatedTemplate;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  return updatedTemplate;
};

export const deleteTemplate = (templateId: number): void => {
  const templates = loadTemplates();
  const filteredTemplates = templates.filter((t) => t.id !== templateId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTemplates));
};
