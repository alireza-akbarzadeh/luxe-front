import { Suspense } from 'react';

import { LoginDomain } from '~/src/domains/auth/containers/login.domain';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginDomain />
    </Suspense>
  );
}
