import { t } from "ttag";

import { Button, Group, Paper, Stack, Text } from "metabase/ui";
import type { ConditionalFormattingTemplate } from "metabase-types/api";

import { RuleBackground } from "./RuleBackground";

interface TemplateListItemProps {
  template: ConditionalFormattingTemplate;
  onApply: () => void;
}

export const TemplateListItem = ({
  template,
  onApply,
}: TemplateListItemProps) => {
  return (
    <Paper shadow="xs" p="sm" withBorder>
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
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
        <Button variant="outline" size="xs" onClick={onApply}>
          {t`Apply`}
        </Button>
      </Group>
    </Paper>
  );
};
