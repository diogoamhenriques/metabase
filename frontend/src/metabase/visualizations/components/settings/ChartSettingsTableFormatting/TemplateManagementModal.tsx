import { useEffect, useState } from "react";
import { t } from "ttag";

import {
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "metabase/ui";
import type { ConditionalFormattingTemplate } from "metabase-types/api";

import {
  deleteTemplate,
  loadTemplates,
  updateTemplate,
} from "../../../lib/template-storage";

import { RuleBackground } from "./RuleBackground";

interface TemplateManagementModalProps {
  onClose: () => void;
}

export const TemplateManagementModal = ({
  onClose,
}: TemplateManagementModalProps) => {
  const [templates, setTemplates] = useState<ConditionalFormattingTemplate[]>(
    [],
  );
  const [editingTemplate, setEditingTemplate] =
    useState<ConditionalFormattingTemplate | null>(null);

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  const handleSave = (template: ConditionalFormattingTemplate) => {
    updateTemplate(template);
    setTemplates(loadTemplates());
    setEditingTemplate(null);
  };

  const handleDelete = (templateId: number) => {
    deleteTemplate(templateId);
    setTemplates(loadTemplates());
  };

  return (
    <Modal
      opened
      onClose={onClose}
      title={t`Manage Formatting Templates`}
      size="lg"
    >
      <Stack gap="lg">
        {templates.map((template) => (
          <Paper key={template.id} shadow="xs" p="md" withBorder>
            {editingTemplate?.id === template.id ? (
              <Stack gap="sm">
                <TextInput
                  data-testId="edit-name-input"
                  label={t`Template name`}
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      name: e.currentTarget.value,
                    })
                  }
                />
                <Textarea
                  label={t`Description`}
                  value={editingTemplate.description || ""}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      description: e.currentTarget.value,
                    })
                  }
                />
                <Group gap="xs">
                  <Button
                    onClick={() => handleSave(editingTemplate)}
                  >{t`Save`}</Button>
                  <Button
                    variant="subtle"
                    onClick={() => setEditingTemplate(null)}
                  >
                    {t`Cancel`}
                  </Button>
                </Group>
              </Stack>
            ) : (
              <Group justify="space-between" align="flex-start">
                <Stack gap="xs">
                  <Text fw="bold">{template.name}</Text>
                  {template.description && (
                    <Text size="sm" c="text-medium">
                      {template.description}
                    </Text>
                  )}
                  <Group gap="xs">
                    {template.template_rules.map((rule, index) => (
                      <RuleBackground
                        key={index}
                        rule={rule}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                        }}
                      />
                    ))}
                  </Group>
                </Stack>
                <Group gap="xs">
                  <Button
                    data-testId="edit-template-button"
                    variant="subtle"
                    size="xs"
                    onClick={() => setEditingTemplate(template)}
                  >{t`Edit`}</Button>
                  <Button
                    data-testId="delete-template-button"
                    variant="subtle"
                    color="metabase#17448"
                    size="xs"
                    onClick={() => handleDelete(template.id)}
                  >
                    {t`Delete`}
                  </Button>
                </Group>
              </Group>
            )}
          </Paper>
        ))}
      </Stack>
    </Modal>
  );
};
