
import { createMapWithDynamicLayers, getMapObjectLayer, getTilesetCustomColliders } from "./tilesets.js";
import { Enemy } from "./enemy.js";
import Hero from "./hero.js";

export const BACKGROUND_DEPTH = 0;
export const ENEMY_DEPTH = 10;
export const HERO_DEPTH = 50;


export default class GameScene extends Phaser.Scene {
    constructor() {
        super("game-scene");
    }

    create() {
        this.input.gamepad.on("down", (pad, button, index) => {
            if (!this.hero) {
                let gamepad = pad;

                this.hero = new Hero({
                    scene: this,
                    gamepad
                });
                this.hero.body.setCollideWorldBounds(true); // don't go out of the map

                this.anims.create({
                    key: 'bearDance',
                    frames: this.anims.generateFrameNumbers('dancing-bear', { start: 0, end: 5 }),
                    frameRate: 15,
                    repeat: -1
                });
                this.bear = this.add.sprite(80, 102, 'dancing-bear').play('bearDance');
                this.physics.add.existing(this.bear);
                this.bear.body.setDrag(1000, 0);
                this.bear.body.setMaxVelocity(150, 400);
                this.bear.body.setBounce(0, 0);
                this.bear.body.setCollideWorldBounds(true); // don't go out of the map

                const { map, dynamicLayers } = this.mapData;

                const mapGroundColliders = getTilesetCustomColliders(this, dynamicLayers.ground.layer);
                const mapElementsColliders = getTilesetCustomColliders(this, dynamicLayers.elements.layer);
                this.physics.add.collider(dynamicLayers.ground, [this.hero, this.bear]);
                this.physics.add.collider(dynamicLayers.elements, [this.hero, this.bear]);
                this.physics.add.collider(mapGroundColliders, [this.hero, this.bear]);
                this.elementsCollider = this.physics.add.collider(mapElementsColliders, [this.hero, this.bear]);

                // make the camera follow the hero
                this.cameras.main.startFollow(this.hero);

                const dataLayer = getMapObjectLayer(map, 'data');
                dataLayer.objects.forEach((data) => {
                    const { x, y, name, height, width } = data;
                    if (name === 'hero') {
                        this.hero.setX(
                            Math.round(x)
                        );
                        this.hero.setY(
                            Math.round(y) - height
                        );
                    }
                });
            }
        });

        // load the map
        this.mapData = createMapWithDynamicLayers(
            this,
            'stage2',
            'stage2_tileset',
            'stage2_tileset'
        );
        const { map, dynamicLayers } = this.mapData;

        // Set depths
        dynamicLayers.background?.setDepth(HERO_DEPTH - 3);
        dynamicLayers.ground?.setDepth(HERO_DEPTH - 2);
        dynamicLayers.elements?.setDepth(HERO_DEPTH - 1);
        dynamicLayers.foreground?.setDepth(HERO_DEPTH + 1);
        dynamicLayers.foreground_2?.setDepth(HERO_DEPTH + 2);

        // set the boundaries of our game world
        this.physics.world.bounds.width = dynamicLayers.background.width;
        this.physics.world.bounds.height = dynamicLayers.background.height;
        // this.background.setScale(
        //     this.physics.world.bounds.width
        // );

        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // set background color, so the sky is not black
        this.cameras.main.setBackgroundColor('#ccccff');
    }

    update(time, delta) {
        const { dynamicLayers } = this.mapData;
        Object.values(dynamicLayers).forEach((dynamicLayer) => {
            dynamicLayer.layer.properties.forEach((property) => {
                const { name, value } = property;
                if (value !== 1) {
                    if (name === 'parallaxSpeedX') {
                        dynamicLayer.setX(
                            this.cameras.main.scrollX * value
                        );
                    } else if (name === 'parallaxSpeedY') {
                        dynamicLayer.setY(
                            this.cameras.main.scrollY * value
                        );
                    }
                }
            });
        });
        if (this.hero) {
            this.hero.update();
            // TODO
            if (this.hero.isHeroOnGround()) {
                if (Phaser.Input.Keyboard.JustDown(this.hero.controlKeys.down)) {
                    console.log('go down');
                    this.elementsCollider.active = false;
                    this.time.delayedCall(
                        200,
                        () => {
                            console.log('all normal');
                            this.elementsCollider.active = true;
                        }
                    );
                }
            }
        }
    }
}