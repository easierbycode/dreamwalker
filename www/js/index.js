
import LoadScene from "./load-scene.js";
import GameScene from "./game-scene.js";


const config = {
    type: Phaser.AUTO,
    width: 384,
    height: 240,            // 16:10 would be 240
    pixelArt: true,         // Forces crisp rendering
    roundPixels: true,      // Rounds sprite positions to integers

    // Scene order: first LoadScene, then GameScene
    scene: [LoadScene, GameScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: new URL(window.location.href).searchParams.get("debug") == "1",
            gravity: { y: 700 }
        }
    },
    // Enable gamepad input here
    input: {
        gamepad: true
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    fps: {
        target: new URL(window.location.href).searchParams.get("turbo") ? 144 : 60,
        forceSetTimeOut: true
    }
};

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    document.getElementsByClassName('app')[0].style.display = "none";
    window.game = globalThis.__PHASER_GAME__ = new Phaser.Game(config);
}

if (!window.cordova) {
    setTimeout(() => {
        const e = document.createEvent("Events");
        e.initEvent("deviceready", true, false);
        document.dispatchEvent(e);
    }, 50);
}