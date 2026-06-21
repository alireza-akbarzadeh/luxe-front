import { cookies, headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { localeCookieName, resolveLocale } from './config';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const locale = resolveLocale(
    cookieStore.get(localeCookieName)?.value,
    headerStore.get('accept-language')
  );

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    formats: {
      number: {
        usd: {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        },
        percentWhole: {
          style: 'percent',
          maximumFractionDigits: 0
        },
        decimal1: {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        },
        decimal1Percent: {
          style: 'percent',
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        }
      }
    }
  };
});
