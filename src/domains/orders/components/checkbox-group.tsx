import { Label } from '@/components/ui/label';

interface CheckboxGroupProps {
  label: string;
  options: readonly string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function CheckboxGroup({ label, options, selectedValues, onChange }: CheckboxGroupProps) {
  return (
    <div className='space-y-3'>
      <Label className='text-muted-foreground text-xs font-bold tracking-widest uppercase'>
        {label}
      </Label>
      <div className='flex flex-wrap gap-2'>
        {options.map((opt) => {
          const checked = selectedValues.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => {
                if (checked) onChange(selectedValues.filter((v) => v !== opt));
                else onChange([...selectedValues, opt]);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold tracking-wide uppercase transition-all ${
                checked
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary/40 hover:bg-accent text-muted-foreground'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
