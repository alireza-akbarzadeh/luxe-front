export interface PlatformInfo {
  isIos: boolean;
  isAndroid: boolean;
  isSafari: boolean;
}

export function getPlatformInfo(userAgent: string): PlatformInfo {
  const ua = userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isSafari = /safari/.test(ua) && !/chrome|chromium|edg|opr|fxios/.test(ua);

  return {
    isIos,
    isAndroid,
    isSafari
  };
}
