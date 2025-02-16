
export default class LoadScene extends Phaser.Scene {
    constructor() {
        super("load-scene");
    }

    preload() {
        this.load.setBaseURL("assets");
        this.load.aseprite("player", "player-ninja.png", "player-ninja.json");
        this.load.aseprite("enemyA", "a-ninja-tan.png", "a-ninja-tan.json");

        // Tileset images
        this.load.image("dungeon_tileset", "tilesets/dungeon_tileset.png");
        this.load.image("stage2_tileset", "tilesets/stage2_tileset.png");

        this.load.spritesheet('dancing-bear', 'dancing-bear.png', {
            frameWidth: 18,
            frameHeight: 28
        });

        // Stages
        this.load.tilemapTiledJSON("stage1", "stages/stage1.json");
        this.load.tilemapTiledJSON("stage2", "stages/stage2.json");
    }

    create() {
        this.scene.start("game-scene");
    }
}