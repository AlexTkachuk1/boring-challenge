import Phaser from "phaser";
import "phaser/plugins/spine/dist/SpinePlugin";
import SliderPlugin from "phaser3-rex-plugins/plugins/slider-plugin.js";

import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { Preloader } from "./scenes/Preloader";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  backgroundColor: "#000000",
  parent: "app",
  scene: [Boot, Preloader, Game],
  plugins: {
    global: [
      {
        key: "rexSlider",
        plugin: SliderPlugin,
        start: true,
      },
    ],
    scene: [
      { key: "SpinePlugin", plugin: window.SpinePlugin, mapping: "spine" },
    ],
  },
};

export default new Phaser.Game(config);
