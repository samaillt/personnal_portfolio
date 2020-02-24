const container = document.body;

const options =
{
    length: 100,
    floorWidth: 30,
    nLights: 100,
    lightHeights: [-15, 15],
    speed: [-50, -25],
    speedUp: 0.5,
    fov: 90,
    fovSpeedUp: 150,
    colors: [0x5fdfff, 0x4ca4ea, 0xdb3ffb, 0xf95d93],
    lightsFade: 0.9,
    translationFactorOnMouseMove: 3
};

const myApp = new LightSpeedApp(container, options);
myApp.loadAssets().then(myApp.init);