
import { isset } from './utils.js';

const HERO_DEPTH = 50;
const IS_DEV = new URL(window.location.href).searchParams.get("debug") == "1";

// Running
const RUNNING_RIGHT = 'RUNNING_RIGHT';
const RUNNING_LEFT = 'RUNNING_LEFT';

// Walking
const WALKING_RIGHT = 'WALKING_RIGHT';
const WALKING_LEFT = 'WALKING_LEFT';

// Jumping
const JUMPING_START = 'JUMPING_START';
const JUMPING = 'JUMPING';
const JUMPING_RIGHT = 'JUMPING_RIGHT';
const JUMPING_LEFT = 'JUMPING_LEFT';
const BOOSTING_JUMP = 'BOOSTING_JUMP';
const BOOSTING_JUMP_RIGHT = 'BOOSTING_JUMP_RIGHT';
const BOOSTING_JUMP_LEFT = 'BOOSTING_JUMP_LEFT';
const JUMPING_START_RIGHT = 'JUMPING_START_RIGHT';
const JUMPING_START_LEFT = 'JUMPING_START_LEFT';

// Running && Jumping
const RUN_JUMPING_START = 'RUN_JUMPING_START';
const RUN_JUMPING = 'RUN_JUMPING';
const RUN_JUMPING_RIGHT = 'RUN_JUMPING_RIGHT';
const RUN_JUMPING_LEFT = 'RUN_JUMPING_LEFT';
const RUN_BOOSTING_JUMP = 'RUN_BOOSTING_JUMP';
const RUN_BOOSTING_JUMP_RIGHT = 'RUN_BOOSTING_JUMP_RIGHT';
const RUN_BOOSTING_JUMP_LEFT = 'RUN_BOOSTING_JUMP_LEFT';
const RUN_JUMPING_START_RIGHT = 'RUN_JUMPING_START_RIGHT';
const RUN_JUMPING_START_LEFT = 'RUN_JUMPING_START_LEFT';

// Falling
const FALLING = 'FALLING';
const FALLING_RIGHT = 'FALLING_RIGHT';
const FALLING_LEFT = 'FALLING_LEFT';

// Running && Falling
const RUN_FALLING = 'RUN_FALLING';
const RUN_FALLING_RIGHT = 'RUN_FALLING_RIGHT';
const RUN_FALLING_LEFT = 'RUN_FALLING_LEFT';

// Attacking
const ATTACKING_START = 'ATTACKING_START';

// Idle
const IDLE = 'IDLE';

class Hero extends Phaser.GameObjects.Sprite {
    constructor({
        scene,
        x = 0,
        y = 0,
        enablePhysics = true,
        addToScene = true,
        asset = 'player',
        frame,
        gamepad
    }) {
        super(scene, x, y, asset, frame);
        this.setDepth(HERO_DEPTH);
        this.setOrigin(0, 1);

        // Properties
        this.gamepad = gamepad;
        this.enablePhysics = enablePhysics;
        this.attackDuration = 300;
        this.jumpTimer = 0;
        this.runTimer = 0;
        this.stopRunTimer = 0;
        this.delayStopRunning = false;
        this.pressedRunRight = false;
        this.pressedRunLeft = false;
        this.heroState = IDLE;

        if (addToScene) {
            scene.add.existing(this);
        }

        if (enablePhysics) {
            scene.physics.add.existing(this);
            this.body.setDrag(1000, 0);
            this.body.setMaxVelocity(150, 400);
            // this.body.setSize(18, 26);
            // this.body.setOffset(12, 0);
            this.body.setBounce(0, 0);
        }

        this.createAnimations();
        this.setAnimation('idle');

        // Keep track of previous button state for 'just pressed' logic
        this.prevGamepadButtons = Array(20).fill(false);

        if (IS_DEV) {
            this.debugText = this.scene.add.text(0, 0, '');
            this.debugText.setDepth(900);
            this.debugText.setFontSize(12);
        }

        const {
            LEFT: left,
            RIGHT: right,
            UP: up,
            DOWN: down,
            W: w,
            A: a,
            S: s,
            D: d,
            SPACE: space,
            F: f,
            SHIFT: shift,
            ENTER: enter,
        } = Phaser.Input.Keyboard.KeyCodes;


        this.controlKeys = scene.input.keyboard.addKeys({
            left,
            right,
            up,
            down,
            w,
            a,
            d,
            space,
            f,
            shift,
            enter,
        });
    }

    createAnimations = () => {
        const assetKey = this.texture.key;
        // if (!this.scene.anims.exists(`${assetKey}_idle`)) {
        //     this.scene.anims.create({
        //         key: `${assetKey}_idle`,
        //         frames: this.scene.anims.generateFrameNames(assetKey, {
        //             frames: [
        //                 'hero_idle_01',
        //                 'hero_idle_02',
        //                 'hero_idle_03',
        //             ],
        //         }),
        //         frameRate: 4,
        //         // yoyo: true,
        //         repeat: -1,
        //     });
        // }

        // if (!this.scene.anims.exists(`${assetKey}_walk`)) {
        //     this.scene.anims.create({
        //         key: `${assetKey}_walk`,
        //         frames: this.scene.anims.generateFrameNames(assetKey, {
        //             frames: [
        //                 'hero_run_01',
        //                 'hero_run_02',
        //                 'hero_run_03',
        //                 'hero_run_04',
        //                 'hero_run_05',
        //                 'hero_run_06',
        //                 'hero_run_07',
        //                 'hero_run_08',
        //             ],
        //         }),
        //         frameRate: 10,
        //         // yoyo: true,
        //         repeat: -1,
        //     });
        // }

        // if (!this.scene.anims.exists(`${assetKey}_jump`)) {
        //     this.scene.anims.create({
        //         key: `${assetKey}_jump`,
        //         frames: this.scene.anims.generateFrameNames(assetKey, {
        //             frames: [
        //                 'hero_jump_01',
        //             ],
        //         }),
        //         frameRate: 10,
        //         // yoyo: true,
        //         repeat: 0,
        //     });
        // }

        // if (!this.scene.anims.exists(`${assetKey}_attack`)) {
        //     this.scene.anims.create({
        //         key: `${assetKey}_attack`,
        //         frames: this.scene.anims.generateFrameNames(assetKey, {
        //             frames: [
        //                 'hero_attack_01',
        //             ],
        //         }),
        //         frameRate: (5 * 1000) / this.attackDuration,
        //         // yoyo: true,
        //         repeat: 0,
        //     });
        // }

        // if (!this.scene.anims.exists(`${assetKey}_run`)) {
        //     this.scene.anims.create({
        //         key: `${assetKey}_run`,
        //         frames: this.scene.anims.generateFrameNames(assetKey, {
        //             frames: [
        //                 'hero_run_01',
        //                 'hero_run_02',
        //                 'hero_run_03',
        //                 'hero_run_04',
        //                 'hero_run_05',
        //                 'hero_run_06',
        //                 'hero_run_07',
        //                 'hero_run_08',
        //             ],
        //         }),
        //         frameRate: 20,
        //         repeat: -1,
        //     });
        // }

        // Load animations from Aseprite
        const createdAnimations = this.anims.createFromAseprite(assetKey);
        createdAnimations.forEach(animData => {
            const anim = this.anims.get(animData.key);
            if (anim) {
                anim.repeat = -1;
            }
        });
    };

    setAnimation = (animationName, ignoreIfPlaying = true) => {
        if (!isset(this.anims) || this.currentAnimationName === animationName) {
            return;
        }

        const assetKey = this.texture.key;
        const animationKey = `${assetKey}_${animationName}`;
        this.currentAnimationName = animationName;
        this.currentAnimationKey = animationKey;
        this.anims.play(animationKey, ignoreIfPlaying);
    };

    setHeroState(heroState) {
        if (IS_DEV && this.heroState !== heroState) {
            console.log(heroState);
            this.debugText.setText(heroState);
        }
        this.heroState = heroState;
    }

    // Handle button controllers
    isRightDown() {
        let gamepadPressed = false;
        if (this.gamepad && this.gamepad.buttons[15]) {
            gamepadPressed = this.gamepad.buttons[15].pressed;
        }
        return this.controlKeys.right.isDown
            || this.controlKeys.d.isDown
            || gamepadPressed;
    }

    isLeftDown() {
        let gamepadPressed = false;
        if (this.gamepad && this.gamepad.buttons[14]) {
            gamepadPressed = this.gamepad.buttons[14].pressed;
        }
        return this.controlKeys.left.isDown
            || this.controlKeys.a.isDown
            || gamepadPressed;
    }

    isUpDown() {
        let gamepadPressed = false;
        if (this.gamepad && this.gamepad.buttons[12]) {
            gamepadPressed = this.gamepad.buttons[12].pressed;
        }
        return this.controlKeys.up.isDown
            || this.controlKeys.w.isDown
            || gamepadPressed;
    }

    isDownDown() {
        let gamepadPressed = false;
        if (this.gamepad && this.gamepad.buttons[13]) {
            gamepadPressed = this.gamepad.buttons[13].pressed;
        }
        return this.controlKeys.down.isDown
            || this.controlKeys.s.isDown
            || gamepadPressed;
    }

    isAButtonDown() {
        let gamepadPressed = false;
        if (this.gamepad && this.gamepad.buttons[0]) {
            gamepadPressed = this.gamepad.buttons[0].pressed;
        }
        return this.controlKeys.space.isDown
            || gamepadPressed;
    }

    isBButtonDown() {
        let gamepadPressed = false;
        if (this.gamepad && this.gamepad.buttons[1]) {
            gamepadPressed = this.gamepad.buttons[1].pressed;
        }
        return this.controlKeys.f.isDown
            || this.controlKeys.enter.isDown
            || gamepadPressed;
    }

    isRightJustDown() {
        const gamepadJustDown = this._justGamepadDown(15);
        return Phaser.Input.Keyboard.JustDown(this.controlKeys.f)
            || Phaser.Input.Keyboard.JustDown(this.controlKeys.enter)
            || gamepadJustDown;
    }

    _justGamepadDown(buttonIndex) {
        // Returns true if gamepad button is pressed this frame, but not in the previous frame
        if (!this.gamepad || !this.gamepad.buttons[buttonIndex]) {
            return false;
        }
        const pressedNow = this.gamepad.buttons[buttonIndex].pressed;
        const wasPressed = this.prevGamepadButtons[buttonIndex];
        return pressedNow && !wasPressed;
    }

    isLeftJustDown() {
        const gamepadJustDown = this._justGamepadDown(14);
        return Phaser.Input.Keyboard.JustDown(this.controlKeys.left)
            || Phaser.Input.Keyboard.JustDown(this.controlKeys.a)
            || gamepadJustDown;
    }

    isUpJustDown() {
        const gamepadJustDown = this._justGamepadDown(12);
        return Phaser.Input.Keyboard.JustDown(this.controlKeys.up)
            || Phaser.Input.Keyboard.JustDown(this.controlKeys.w)
            || gamepadJustDown;
    }

    isAButtonJustDown() {
        const gamepadJustDown = this._justGamepadDown(0);
        return Phaser.Input.Keyboard.JustDown(this.controlKeys.space)
            || gamepadJustDown;
    }

    isBButtonJustDown() {
        const gamepadJustDown = this._justGamepadDown(1);
        return Phaser.Input.Keyboard.JustDown(this.controlKeys.f)
            || Phaser.Input.Keyboard.JustDown(this.controlKeys.enter)
            || gamepadJustDown;
    }

    calculateHeroAccelerationX() {
        if (this.isHeroRunning()) {
            this.body.setMaxVelocity(250, 400);
            return 600;
        }

        this.body.setMaxVelocity(150, 400);
        if (this.isHeroJumping() || this.isHeroFalling()) {
            return 200;
        }

        return 600;
    }

    calculateHeroAccelerationY() {
        this.body.setMaxVelocity(150, 400);
        return 200;
    }

    // Handle is hero jumping
    isHeroJumping() {
        // Is hero jumping? Doesn't the other states
        return this.isHeroJumpingStraight()
            || this.isHeroJumpingLeft()
            || this.isHeroJumpingRight();
    }

    isHeroJumpingWhileRunning() {
        return this.isHeroJumpingStraightWhileRunning()
            || this.isHeroJumpingLeftWhileRunning()
            || this.isHeroJumpingRightWhileRunning();
    }

    isHeroJumpingWhileWalking() {
        return this.isHeroJumpingStraightWhileWalking()
            || this.isHeroJumpingLeftWhileWalking()
            || this.isHeroJumpingRightWhileWalking();
    }

    isHeroJumpingStraight() {
        return this.isHeroJumpingStraightWhileRunning()
            || this.isHeroJumpingStraightWhileWalking();
    }

    isHeroJumpingStraightWhileRunning() {
        return [
            RUN_JUMPING_START,
            RUN_BOOSTING_JUMP,
            RUN_JUMPING,
        ].includes(this.heroState);
    }

    isHeroJumpingStraightWhileWalking() {
        return [
            JUMPING_START,
            BOOSTING_JUMP,
            JUMPING,
        ].includes(this.heroState);
    }

    isHeroJumpingLeft() {
        return this.isHeroJumpingLeftWhileRunning()
            || this.isHeroJumpingLeftWhileWalking();
    }

    isHeroJumpingLeftWhileRunning() {
        return [
            RUN_JUMPING_START_LEFT,
            RUN_BOOSTING_JUMP_LEFT,
            RUN_JUMPING_LEFT,
        ].includes(this.heroState);
    }

    isHeroJumpingLeftWhileWalking() {
        return [
            JUMPING_START_LEFT,
            BOOSTING_JUMP_LEFT,
            JUMPING_LEFT,
        ].includes(this.heroState);
    }

    isHeroJumpingRight() {
        return this.isHeroJumpingRightWhileRunning()
            || this.isHeroJumpingRightWhileWalking();
    }

    isHeroJumpingRightWhileRunning() {
        return [
            RUN_JUMPING_START_RIGHT,
            RUN_BOOSTING_JUMP_RIGHT,
            RUN_JUMPING_RIGHT,
        ].includes(this.heroState);
    }

    isHeroJumpingRightWhileWalking() {
        return [
            JUMPING_START_RIGHT,
            BOOSTING_JUMP_RIGHT,
            JUMPING_RIGHT,
        ].includes(this.heroState);
    }

    isHeroFalling() {
        return this.isHeroFallingStraight()
            || this.isHeroFallingLeft()
            || this.isHeroFallingRight();
    }

    isHeroFallingWhileWalking() {
        return this.isHeroFallingStraightWhileWalking()
            || this.isHeroFallingLeftWhileWalking()
            || this.isHeroFallingRightWhileWalking();
    }

    isHeroFallingWhileRunning() {
        return this.isHeroFallingStraightWhileRunning()
            || this.isHeroFallingLeftWhileRunning()
            || this.isHeroFallingRightWhileRunning();
    }

    isHeroFallingStraight() {
        return this.isHeroFallingStraightWhileWalking()
            || this.isHeroFallingStraightWhileRunning();
    }

    isHeroFallingStraightWhileWalking() {
        return [
            FALLING,
        ].includes(this.heroState);
    }

    isHeroFallingStraightWhileRunning() {
        return [
            RUN_FALLING,
        ].includes(this.heroState);
    }

    isHeroFallingLeft() {
        return this.isHeroFallingLeftWhileWalking()
            || this.isHeroFallingLeftWhileRunning();
    }

    isHeroFallingLeftWhileWalking() {
        return [
            FALLING_LEFT,
        ].includes(this.heroState);
    }

    isHeroFallingLeftWhileRunning() {
        return [
            RUN_FALLING_LEFT,
        ].includes(this.heroState);
    }

    isHeroFallingRight() {
        return this.isHeroFallingRightWhileWalking()
            || this.isHeroFallingRightWhileRunning();
    }

    isHeroFallingRightWhileWalking() {
        return [
            FALLING_RIGHT,
        ].includes(this.heroState);
    }

    isHeroFallingRightWhileRunning() {
        return [
            RUN_FALLING_RIGHT,
        ].includes(this.heroState);
    }

    isHeroOnGround() {
        return this.body.blocked.down || this.body.touching.down;
    }

    isHeroRunning() {
        // Is hero running? Doesn't the other states
        return this.isHeroRunningRight()
            || this.isHeroRunningLeft()
            || this.isHeroRunningWhileFallingStraight()
            || this.delayStopRunning;
    }

    isHeroRunningRight() {
        return this.isHeroRunningRightWhileJumping()
            || this.isHeroRunningRightOnGround()
        || this.isHeroRunningRightWhileFalling();
    }

    isHeroRunningRightWhileJumping() {
        return [
            RUN_JUMPING_RIGHT,
            RUN_BOOSTING_JUMP_RIGHT,
            RUN_JUMPING_START_RIGHT,
        ].includes(this.heroState);
    }

    isHeroRunningRightOnGround() {
        return [
            RUNNING_RIGHT,
        ].includes(this.heroState);
    }

    isHeroRunningRightWhileFalling() {
        return [
            RUN_FALLING_RIGHT,
        ].includes(this.heroState);
    }

    isHeroRunningLeft() {
        return this.isHeroRunningLeftWhileJumping()
            || this.isHeroRunningLeftWhileOnGround()
            || this.isHeroRunningLeftWhileFalling();
    }

    isHeroRunningLeftWhileJumping() {
        return [
            RUN_JUMPING_LEFT,
            RUN_BOOSTING_JUMP_LEFT,
            RUN_JUMPING_START_LEFT,
        ].includes(this.heroState);
    }

    isHeroRunningLeftWhileOnGround() {
        return [
            RUNNING_LEFT,
        ].includes(this.heroState);
    }

    isHeroRunningLeftWhileFalling() {
        return [
            RUN_FALLING_LEFT,
        ].includes(this.heroState);
    }

    isHeroRunningWhileFallingStraight() {
        return this.heroState === RUN_FALLING;
    }

    update(time, delta) {
        if (IS_DEV) {
            this.debugText.setX(this.x);
            this.debugText.setY(this.y - 50);
        }

        this.handleHeroState();
        this.handleHeroMovement();
        this.handleHeroAnimation();
        this.gamepad?.buttons.forEach((button, index) => {
            
            this.prevGamepadButtons[index] = button.pressed;

        });
    }

    handleHeroState() {
        const isRightDown = this.isRightDown();
        const isLeftDown = this.isLeftDown();
        const isUpDown = this.isUpDown();
        const isAButtonDown = this.isAButtonDown();
        const pressedRight = this.isRightJustDown();
        const pressedLeft = this.isLeftJustDown();
        const isJumping = this.isHeroJumping();

        // Handle hero idle
        if (this.isHeroOnGround() && !this.delayStopRunning) {
            if (!isRightDown && !isLeftDown) {
                if (([
                    RUNNING_RIGHT,
                    RUNNING_LEFT,
                    WALKING_RIGHT,
                    WALKING_LEFT,
                ].includes(this.heroState)
                    || this.isHeroFalling()
                )) {
                    this.setHeroState(IDLE);
                    return;
                }
            }

            // This fixes the bug when jumping
            // up a wall or something with collidesUp only true
            if (([
                JUMPING,
                JUMPING_RIGHT,
                JUMPING_LEFT,
            ].includes(this.heroState)
            )) {
                this.setHeroState(IDLE);
                return;
            }
        }

        // Handle hero running
        if (!isJumping) {
            if (this.runTimer <= 0) {
                if (pressedRight || pressedLeft) {
                    this.pressedRunRight = pressedRight;
                    this.pressedRunLeft = pressedLeft;
                    this.runTimer = 1;
                } else if (
                    this.isHeroOnGround()
                    && this.isHeroRunning()
                    && !this.delayStopRunning
                    && (isRightDown || isLeftDown)
                ) {
                    // This will handle when hero just jumped while running
                    this.delayStopRunning = true;
                    if (isRightDown) {
                        this.setHeroState(RUNNING_RIGHT);
                    } else if (isLeftDown) {
                        this.setHeroState(RUNNING_LEFT);
                    }
                }
            } else if (this.runTimer <= 10) {
                if (this.pressedRunRight && isRightDown && pressedRight) {
                    this.setHeroState(RUNNING_RIGHT);
                    this.delayStopRunning = true;
                } else if (this.pressedRunLeft && isLeftDown && pressedLeft) {
                    this.setHeroState(RUNNING_LEFT);
                    this.delayStopRunning = true;
                }
            } else {
                this.runTimer = 0;
                this.pressedRunRight = false;
                this.pressedRunLeft = false;
            }

            if (this.runTimer > 0) {
                this.runTimer += 1;
            }

            if (this.delayStopRunning) {
                if (!isRightDown && !isLeftDown) {
                    this.stopRunTimer += 1;
                    if (this.stopRunTimer > 6) {
                        this.delayStopRunning = false;
                        this.stopRunTimer = 0;
                    }
                } else if (!isLeftDown && isRightDown && this.heroState === RUNNING_LEFT) {
                    this.setHeroState(RUNNING_RIGHT);
                } else if (!isRightDown && isLeftDown && this.heroState === RUNNING_RIGHT) {
                    this.setHeroState(RUNNING_LEFT);
                }
            }
        } else {
            this.delayStopRunning = false;
        }

        // Handle hero walking
        if (this.isHeroOnGround() && !isJumping && !this.isHeroRunning()) {
            if (isRightDown) {
                this.setHeroState(WALKING_RIGHT);
            } else if (isLeftDown) {
                this.setHeroState(WALKING_LEFT);
            }
        }

        // Handle hero jumping
        if (this.isHeroOnGround() && (this.isUpJustDown() || this.isAButtonJustDown())) {
            this.jumpTimer = 1;
            let newHeroState = JUMPING_START;
            if (this.isHeroRunning()) {
                newHeroState = RUN_JUMPING_START;
            }
            this.setHeroState(newHeroState);
        } else if (this.jumpTimer !== 0) {
            if (isUpDown || isAButtonDown) {
                this.jumpTimer += 1;
                if (this.jumpTimer > 8) {
                    // hero has been holding jump for over 100 milliseconds
                    // it's time to stop the hero
                    this.jumpTimer = 0;
                    let newHeroState = JUMPING;
                    if (this.isHeroRunning()) {
                        newHeroState = RUN_JUMPING;
                    }
                    this.setHeroState(newHeroState);
                } else if (this.jumpTimer > 7) {
                    let newHeroState = BOOSTING_JUMP;
                    if (this.isHeroRunning()) {
                        newHeroState = RUN_BOOSTING_JUMP;
                    }
                    this.setHeroState(newHeroState);
                }
            } else {
                this.jumpTimer = 0;
                let newHeroState = JUMPING;
                if (this.isHeroRunning()) {
                    newHeroState = RUN_JUMPING;
                }
                this.setHeroState(newHeroState);
            }
        }

        // Check if it is jumping in a certain direction
        if (this.isHeroJumping()) {
            let newHeroState = this.heroState;
            let runningPrefix = '';
            if (
                this.isHeroRunning()
                && ![
                    RUN_JUMPING_START,
                    RUN_BOOSTING_JUMP,
                    RUN_JUMPING,
                    RUN_JUMPING_START_LEFT,
                    RUN_BOOSTING_JUMP_LEFT,
                    RUN_JUMPING_LEFT,
                    RUN_JUMPING_START_RIGHT,
                    RUN_BOOSTING_JUMP_RIGHT,
                    RUN_JUMPING_RIGHT,
                ].includes(this.heroState)) {
                runningPrefix = '_RUN';
            }

            if (isRightDown) {
                if ([JUMPING_START, BOOSTING_JUMP, JUMPING, RUN_JUMPING_START, RUN_BOOSTING_JUMP, RUN_JUMPING].includes(this.heroState)) {
                    newHeroState = `${runningPrefix}${this.heroState}_RIGHT`;
                } else if ([JUMPING_START_LEFT, BOOSTING_JUMP_LEFT, JUMPING_LEFT, RUN_JUMPING_START_LEFT, RUN_BOOSTING_JUMP_LEFT, RUN_JUMPING_LEFT].includes(this.heroState)) {
                    const parts = this.heroState.split('_LEFT');
                    newHeroState = `${runningPrefix}${parts[0]}_RIGHT`;
                }
            } else if (isLeftDown) {
                if ([JUMPING_START, BOOSTING_JUMP, JUMPING, RUN_JUMPING_START, RUN_BOOSTING_JUMP, RUN_JUMPING].includes(this.heroState)) {
                    newHeroState = `${runningPrefix}${this.heroState}_LEFT`;
                } else if ([JUMPING_START_RIGHT, BOOSTING_JUMP_RIGHT, JUMPING_RIGHT, RUN_JUMPING_START_RIGHT, RUN_BOOSTING_JUMP_RIGHT, RUN_JUMPING_RIGHT].includes(this.heroState)) {
                    const parts = this.heroState.split('_RIGHT');
                    newHeroState = `${runningPrefix}${parts[0]}_LEFT`;
                }
            }
            this.setHeroState(newHeroState);
        }

        // If it's already jumping and pressed the jump button
        // bail
        if (isJumping) {
            if (this.isUpJustDown() || this.isAButtonJustDown()) {
                return;
            }
        }

        // Handle hero falling
        if (!this.isHeroFalling() && this.body.velocity.y > 0 && !this.isHeroOnGround()) {
            if (this.isHeroRunning()) {
                if (![RUNNING_RIGHT, RUNNING_LEFT].includes(this.heroState)) {
                    this.setHeroState(RUN_FALLING);
                }
            } else {
                this.setHeroState(FALLING);
            }
        }

        // Check if it is falling in a certain direction
        if (this.isHeroFalling() && !this.isHeroOnGround()) {
            if (isRightDown) {
                let newHeroState = this.heroState;
                if ([FALLING, FALLING_LEFT, RUN_FALLING, RUN_FALLING_LEFT].includes(this.heroState)) {
                    newHeroState = FALLING_RIGHT;
                    if (this.isHeroRunning()) {
                        newHeroState = RUN_FALLING_RIGHT;
                    }
                }
                this.setHeroState(newHeroState);
            } else if (isLeftDown) {
                let newHeroState = this.heroState;
                if ([FALLING, FALLING_RIGHT, RUN_FALLING, RUN_FALLING_RIGHT].includes(this.heroState)) {
                    newHeroState = FALLING_LEFT;
                    if (this.isHeroRunning()) {
                        newHeroState = RUN_FALLING_LEFT;
                    }
                }
                this.setHeroState(newHeroState);
            }
        }

        // handle hero attacking
        if (this.isHeroOnGround() && this.isBButtonJustDown()) {
            this.setHeroState(ATTACKING_START);
        }
    }

    handleHeroMovement() {
        const { heroState } = this;
        const accelerationY = this.calculateHeroAccelerationY();
        const accelerationX = this.calculateHeroAccelerationX();

        if (this.isHeroOnGround()) {
            if (!this.isHeroRunning()) {
                this.body.setVelocityY(0);
            }
        }

        // Handle walking movement
        if (heroState === WALKING_RIGHT) {
            this.body.setAccelerationX(accelerationX);
        } else if (heroState === WALKING_LEFT) {
            this.body.setAccelerationX(-accelerationX);
        }

        if (heroState === RUNNING_RIGHT) {
            this.body.setAccelerationX(accelerationX);
        } else if (heroState === RUNNING_LEFT) {
            this.body.setAccelerationX(-accelerationX);
        }

        // Handle jumping movement
        if ([
            JUMPING_START,
            BOOSTING_JUMP,
            JUMPING_START_RIGHT,
            BOOSTING_JUMP_RIGHT,
            JUMPING_START_LEFT,
            BOOSTING_JUMP_LEFT,
            RUN_JUMPING_START,
            RUN_BOOSTING_JUMP,
            RUN_JUMPING_START_RIGHT,
            RUN_BOOSTING_JUMP_RIGHT,
            RUN_JUMPING_START_LEFT,
            RUN_BOOSTING_JUMP_LEFT,
        ].includes(heroState)) {
            // does not includes the JUMPING status
            this.body.setVelocityY(-accelerationY);
        }

        if ([
            JUMPING_RIGHT,
            JUMPING_START_RIGHT,
            BOOSTING_JUMP_RIGHT,
            RUN_JUMPING_RIGHT,
            RUN_JUMPING_START_RIGHT,
            RUN_BOOSTING_JUMP_RIGHT,
        ].includes(heroState)) {
            this.body.setAccelerationX(accelerationX);
        }

        if ([
            JUMPING_LEFT,
            JUMPING_START_LEFT,
            BOOSTING_JUMP_LEFT,
            RUN_JUMPING_LEFT,
            RUN_JUMPING_START_LEFT,
            RUN_BOOSTING_JUMP_LEFT,
        ].includes(heroState)) {
            this.body.setAccelerationX(-accelerationX);
        }

        // Handle idle movement
        if (heroState === IDLE) {
            this.body.setAccelerationX(0);
        }
    }

    handleHeroAnimation() {
        const { heroState } = this;

        // Handle walking animation
        if (heroState === WALKING_RIGHT) {
            this.setAnimation('walk');
            this.setFlipX(false);
            // this.body.setOffset(10, 4); // TODO
        } else if (heroState === WALKING_LEFT) {
            this.setAnimation('walk');
            this.setFlipX(true);
            // this.body.setOffset(4, 4); // TODO
        }

        if (heroState === RUNNING_RIGHT) {
            this.setAnimation('run');
            this.setFlipX(false);
            // this.body.setOffset(8, -2); // TODO
        } else if (heroState === RUNNING_LEFT) {
            this.setAnimation('run');
            this.setFlipX(true);
            // this.body.setOffset(6, 4); // TODO
        }

        // Handle jumping animation
        if (this.isHeroJumping()) {
            // this.body.setOffset(8, -2);
            if (this.isHeroRunning()) {
                this.setAnimation('run_jump');
            } else {
                this.setAnimation('jump');
            }
        }

        // Handle falling animation
        if (this.isHeroFalling()) {
            // this.body.setOffset(8, -2);
            if (this.isHeroRunning()) {
                // this.setFrame('hero_fall_01');
                this.setFrame('1');
            } else {
                // this.setFrame('hero_fall_01');
                this.setFrame('1');
            }
        }

        // Handle idle animation
        if (heroState === IDLE) {
            this.setAnimation('idle');
            // this.body.setOffset(8, -2); // TODO
        }
    }
}

export default Hero;