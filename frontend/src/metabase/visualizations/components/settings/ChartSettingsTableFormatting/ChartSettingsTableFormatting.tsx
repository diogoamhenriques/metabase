import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

import type {
  ColumnFormattingSetting,
  ConditionalFormattingTemplate,
  DatasetColumn,
} from "metabase-types/api";

import { loadTemplates } from "../../../lib/template-storage";

import { RuleEditor } from "./RuleEditor";
import { RuleListing } from "./RuleListing";
import { SaveTemplateModal } from "./SaveTemplateModal";
import { TemplateList } from "./TemplateList";
import { TemplateManagementModal } from "./TemplateManagementModal";
import { DEFAULTS_BY_TYPE } from "./constants";

export interface ChartSettingsTableFormattingProps {
  value: ColumnFormattingSetting[];
  onChange: (rules: ColumnFormattingSetting[]) => void;
  cols: DatasetColumn[];
  canHighlightRow?: boolean;
}

export const ChartSettingsTableFormatting = ({
  value,
  onChange,
  cols,
  canHighlightRow,
}: ChartSettingsTableFormattingProps) => {
  const [editingRule, setEditingRule] = useState<number | null>(null);
  const [editingRuleIsNew, setEditingRuleIsNew] = useState<boolean | null>(
    null,
  );
  const [templates, setTemplates] = useState<ConditionalFormattingTemplate[]>(
    [],
  );
  const [isManagingTemplates, setIsManagingTemplates] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  useEffect(() => {
    // Load templates from browser storage when component mounts
    setTemplates(loadTemplates());
  }, []);

  const handleApplyTemplate = (template: ConditionalFormattingTemplate) => {
    onChange([...template.template_rules, ...value]);
  };

  if (editingRule !== null && value[editingRule]) {
    return (
      <RuleEditor
        canHighlightRow={canHighlightRow}
        rule={value[editingRule]}
        cols={cols}
        isNew={!!editingRuleIsNew}
        onChange={(rule) => {
          onChange([
            ...value.slice(0, editingRule),
            rule,
            ...value.slice(editingRule + 1),
          ]);
        }}
        onRemove={() => {
          onChange([
            ...value.slice(0, editingRule),
            ...value.slice(editingRule + 1),
          ]);
          setEditingRule(null);
          setEditingRuleIsNew(null);
        }}
        onDone={() => {
          setEditingRule(null);
          setEditingRuleIsNew(null);
        }}
      />
    );
  }

  return (
    <>
      <TemplateList
        templates={templates}
        onApplyTemplate={handleApplyTemplate}
        onSaveAsTemplate={() => setIsSavingTemplate(true)}
        onManageTemplates={() => setIsManagingTemplates(true)}
      />

      <RuleListing
        rules={value}
        cols={cols}
        onEdit={(index) => {
          setEditingRule(index);
          setEditingRuleIsNew(false);
        }}
        onAdd={async () => {
          await onChange([
            {
              ...DEFAULTS_BY_TYPE["single"],
              columns: cols.length === 1 ? [cols[0].name] : [],
            },
            ...value,
          ]);
          setEditingRuleIsNew(true);
          setEditingRule(0);
        }}
        onRemove={(index) => {
          onChange([...value.slice(0, index), ...value.slice(index + 1)]);
        }}
        onMove={(from, to) => {
          onChange(arrayMove(value, from, to));
        }}
      />

      {isManagingTemplates && (
        <TemplateManagementModal
          onClose={() => {
            setIsManagingTemplates(false);
            setTemplates(loadTemplates());
          }}
        />
      )}

      {isSavingTemplate && (
        <SaveTemplateModal
          rules={value}
          onClose={() => setIsSavingTemplate(false)}
          onSaved={() => {
            setTemplates(loadTemplates());
            setIsSavingTemplate(false);
          }}
        />
      )}
    </>
  );
};
