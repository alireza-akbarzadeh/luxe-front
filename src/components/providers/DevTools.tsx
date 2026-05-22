import {TanStackDevtools} from '@tanstack/react-devtools';
import {ReactQueryDevtoolsPanel} from '@tanstack/react-query-devtools';
import {formDevtoolsPlugin} from '@tanstack/react-form-devtools';

export function DevTools() {
    return (
        <TanStackDevtools
            config={{position: 'bottom-right'}}
            plugins={[
                {
                    name: 'React Query',
                    render: <ReactQueryDevtoolsPanel/>,
                    defaultOpen: false,
                },
                formDevtoolsPlugin(),
            ]}
        />
    );
}