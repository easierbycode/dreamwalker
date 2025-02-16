
export class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key) {
        super(scene, x, y, key);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
    }
}