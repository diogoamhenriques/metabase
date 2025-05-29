import { useState } from "react";
import { t } from "ttag";

import { Button, Group, Stack, Text } from "metabase/ui";
import type { ConditionalFormattingTemplate } from "metabase-types/api";

import { TemplateListItem } from "./TemplateListItem";

interface TemplateListProps {
  templates: ConditionalFormattingTemplate[];
  onApplyTemplate: (template: ConditionalFormattingTemplate) => void;
  onSaveAsTemplate: () => void;
  onManageTemplates: () => void;
}

export const TemplateList = ({
  templates = [],
  onApplyTemplate,
  onSaveAsTemplate,
  onManageTemplates,
}: TemplateListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const validTemplates = Array.isArray(templates) ? templates : [];

  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text fw="bold" fz="lg">{t`Templates`}</Text>
        <Text c="text-medium">{t`Apply a saved formatting template or save your current rules as a template.`}</Text>
      </Stack>

      {validTemplates.length > 0 && (
        <Stack gap="xs">
          {validTemplates
            .slice(0, isExpanded ? undefined : 3)
            .map((template) => (
              <TemplateListItem
                key={template.id}
                template={template}
                onApply={() => onApplyTemplate(template)}
              />
            ))}
          {validTemplates.length > 3 && !isExpanded && (
            <Button
              variant="subtle"
              onClick={() => setIsExpanded(true)}
            >{t`Show all ${validTemplates.length} templates`}</Button>
          )}
        </Stack>
      )}

      <Group gap="xs">
        <Button
          variant="outline"
          onClick={onSaveAsTemplate}
        >{t`Save current rules as template`}</Button>
        <Button
          variant="subtle"
          onClick={onManageTemplates}
        >{t`Manage templates`}</Button>
      </Group>
    </Stack>
  );
};
