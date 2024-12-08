/// <reference types="vite/client" />

/// <reference types="phaser/types/SpineFile.d.ts" />
/// <reference types="phaser/types/SpineGameObject.d.ts" />
/// <reference types="phaser/types/SpinePlugin.d.ts" />

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html
declare interface Window {
  SpinePlugin: any;
}
