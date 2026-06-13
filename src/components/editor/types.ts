export interface JsonFieldProps {
  label?: string;
  placeholder?: string;
  className?: string;

  height?: number | string;

  readonly?: boolean;
  disabled?: boolean;

  formatOnMount?: boolean;
}
