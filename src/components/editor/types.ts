import type * as Monaco from '@monaco-editor/react';

export interface JsonFieldProps {
  label?: string;
  placeholder?: string;
  className?: string;

  height?: number | string;

  readonly?: boolean;
  disabled?: boolean;

  formatOnMount?: boolean;

  schema?: Monaco.languages.json.DiagnosticsOptions['schemas'];

  editorOptions?: Monaco.editor.IStandaloneEditorConstructionOptions;
}
