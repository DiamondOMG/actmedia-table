// global.d.ts

export {};

declare global {
  var _cachedSheetsClient: ReturnType<typeof import("googleapis").google.sheets> | undefined;
}
