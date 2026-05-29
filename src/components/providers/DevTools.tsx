import { TanStackDevtools } from '@tanstack/react-devtools';
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';

export function DevTools() {
  return (
    <TanStackDevtools
      config={{ position: 'bottom-right' }}
      plugins={[
        {
          name: 'React Query',
          render: <ReactQueryDevtoolsPanel />,
          defaultOpen: false
        },
        formDevtoolsPlugin()
      ]}
    />
  );
}
