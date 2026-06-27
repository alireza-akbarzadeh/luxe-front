import { spawnSync } from 'node:child_process';

import { createSerwistRoute } from '@serwist/turbopack';
import { NextResponse } from 'next/server';

const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf-8' }).stdout?.trim() ??
  crypto.randomUUID();

const serwistRoute = createSerwistRoute({
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
  swSrc: 'src/app/sw.ts',
  useNativeEsbuild: true,
  // Browserslist includes safari11; native esbuild cannot downlevel destructuring for that target.
  esbuildOptions: { target: 'es2020' }
});

export const { dynamic, dynamicParams, revalidate, generateStaticParams } = serwistRoute;

/** Do not serve a real SW in development — avoids Turbopack navigation intercept errors. */
export async function GET(request: Request, context: { params: Promise<{ path: string }> }) {
  if (process.env.NODE_ENV === 'development') {
    return new NextResponse(null, { status: 404 });
  }

  return serwistRoute.GET(request, context);
}
