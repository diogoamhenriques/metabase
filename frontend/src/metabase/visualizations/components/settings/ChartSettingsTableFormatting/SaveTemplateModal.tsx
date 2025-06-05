import { useState } from "react";
import { t } from "ttag";

import { Button, Group, Modal, Stack, TextInput, Textarea } from "metabase/ui";
import type { ConditionalFormattingRule } from "metabase-types/api";

import { saveTemplate } from "../../../lib/template-storage";

interface SaveTemplateModalProps {
  rules: ConditionalFormattingRule[];
  onClose: () => void;
  onSaved: () => void;
}

export const SaveTemplateModal = ({
  rules,
  onClose,
  onSaved,
}: SaveTemplateModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    saveTemplate({
      name,
      description,
      template_rules: rules,
    });
    onSaved();
    onClose();
  };

  return (
    <Modal opened onClose={onClose} title={t`Save as Template`} size="sm">
      <Stack gap="md">
        <TextInput
          data-testId="template-name-input"
          label={t`Template name`}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        <Textarea
          label={t`Description`}
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          placeholder={t`Optional description`}
        />
        <Group justify="flex-end" gap="xs">
          <Button variant="subtle" onClick={onClose}>
            {t`Cancel`}
          </Button>
          <Button onClick={handleSave} disabled={!name}>
            {t`Save`}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
