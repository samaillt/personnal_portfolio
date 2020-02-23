class App 
{
    constructor(container, options = {})
    {
        this.initialCameraPos = new THREE.Vector3(0, 0, 0);
        this.options = options;
        this.container = container;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(container.offsetWidth, container.offsetHeight, false);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.composer = new POSTPROCESSING.EffectComposer(this.renderer);
        container.append(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
            options.fov,
            container.offsetWidth / container.offsetHeight,
            0.1,
            10000
        );
        this.camera.position.x = this.initialCameraPos.x;
        this.camera.position.y = this.initialCameraPos.y;
        this.camera.position.z = this.initialCameraPos.z;
        this.scene = new THREE.Scene();

        var fog = new THREE.Fog(
            options.colors.background,
            options.length * 0.2,
            options.length * 500
        );
        this.scene.fog = fog;
        this.fogUniforms = {
            fogColor: { type: "c", value: fog.color },
            fogNear: { type: "f", value: fog.near },
            fogFar: { type: "f", value: fog.far }
        };
        
        this.clock = new THREE.Clock();
        this.assets = {};
        this.disposed = false;

        this.lights = new Lights(this, options);

        this.fovTarget = options.fov;

        this.speedUpTarget = 0;
        this.speedUp = 0;
        this.timeOffset = 0;

        this.tick = this.tick.bind(this);
        this.init = this.init.bind(this);
        this.setSize = this.setSize.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);

        this.xTargetTranslation = 0;
        this.yTargetTranslation = 0;

        this.container.addEventListener('mousemove', e => {
            const halfContainerWidth = e.currentTarget.offsetWidth / 2;
            const halfContainerHeight = e.currentTarget.offsetHeight / 2;

            this.xTargetTranslation = (e.clientX - halfContainerWidth) * this.options.translationFactorOnMouseMove / halfContainerWidth;
            this.yTargetTranslation = (e.clientY - halfContainerHeight) * this.options.translationFactorOnMouseMove / halfContainerHeight;
        });
    }
    initPasses()
    {
        this.renderPass = new POSTPROCESSING.RenderPass(this.scene, this.camera);
        this.bloomPass = new POSTPROCESSING.EffectPass(
            this.camera,
            new POSTPROCESSING.BloomEffect({
                luminanceThreshold: 0.2,
                luminanceSmoothing: 0,
                resolutionScale: 1
            })
        );
        const smaaPass = new POSTPROCESSING.EffectPass(
            this.camera,
            new POSTPROCESSING.SMAAEffect(
                this.assets.smaa.search,
                this.assets.smaa.area,
                POSTPROCESSING.SMAAPreset.MEDIUM
            )
        );
        this.renderPass.renderToScreen = false;
        this.bloomPass.renderToScreen = false;
        smaaPass.renderToScreen = true;
        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.bloomPass);
        this.composer.addPass(smaaPass);
    }
    loadAssets()
    {
        const assets = this.assets;
        return new Promise((resolve, reject) => {
        const manager = new THREE.LoadingManager(resolve);

        const searchImage = new Image();
        const areaImage = new Image();
        assets.smaa = {};
        searchImage.addEventListener("load", function() {
            assets.smaa.search = this;
            manager.itemEnd("smaa-search");
        });

        areaImage.addEventListener("load", function() {
            assets.smaa.area = this;
            manager.itemEnd("smaa-area");
        });
        manager.itemStart("smaa-search");
        manager.itemStart("smaa-area");

        searchImage.src = POSTPROCESSING.SMAAEffect.searchImageDataURL;
        areaImage.src = POSTPROCESSING.SMAAEffect.areaImageDataURL;
        });
    }
    init()
    {
        this.initPasses();
        const options = this.options;
        this.lights.init();

        this.container.addEventListener("mousedown", this.onMouseDown);
        this.container.addEventListener("mouseup", this.onMouseUp);
        this.container.addEventListener("mouseout", this.onMouseOut);

        this.tick();
    }
    onMouseDown(ev)
    {
        this.fovTarget = this.options.fovSpeedUp;
        this.speedUpTarget = this.options.speedUp;
    }
    onMouseUp(ev)
    {
        this.fovTarget = this.options.fov;
        this.speedUpTarget = 0;
    }
    onMouseOut(ev)
    {
        var list = traverseChildren(ev.currentTarget);
        var e = ev.toElement || ev.relatedTarget;
        if (!!~list.indexOf(e))
        {
            return;
        }
        this.fovTarget = this.options.fov;
        this.speedUpTarget = 0;
    }
    onClick(ev)
    {
        this.lightSpeed = !this.lightSpeed;
        this.fovTarget = (this.lightSpeed) ? this.options.fov : this.options.fovSpeedUp;
        this.speedUpTarget = (this.lightSpeed) ? 0 : this.options.speedUp;
    }
    update(delta)
    {
        var lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
        this.speedUp += lerp(
            this.speedUp,
            this.speedUpTarget,
            lerpPercentage,
            0.00001
        );
        this.timeOffset += this.speedUp * delta;

        var time = this.clock.elapsedTime + this.timeOffset;

        this.lights.update(time);
        var updateCamera = false;
        var fovChange = lerp(this.camera.fov, this.fovTarget, lerpPercentage);
        if (fovChange !== 0)
        {
            this.camera.fov += fovChange * delta * 6;
            updateCamera = true;
        }
        if (this.xTargetTranslation != 0)
        {
            this.camera.position.x = lerp2(this.camera.position.x, this.initialCameraPos.x - this.xTargetTranslation, 0.5);
            updateCamera = true;
        }
        if (this.yTargetTranslation != 0)
        {
            this.camera.position.y = lerp2(this.camera.position.y, this.initialCameraPos.y + this.yTargetTranslation, 0.5);
            updateCamera = true;
        }
        if (updateCamera)
        {
            this.camera.updateProjectionMatrix();
        }
    }
    render(delta)
    {
        this.composer.render(delta);
    }
    dispose()
    {
        this.disposed = true;
    }
    setSize(width, height, updateStyles)
    {
        this.composer.setSize(width, height, updateStyles);
    }
    tick()
    {
        if (this.disposed || !this) return;
        if (resizeRendererToDisplaySize(this.renderer, this.setSize)) {
        const canvas = this.renderer.domElement;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        }
        const delta = this.clock.getDelta();
        this.render(delta);
        this.update(delta);
        requestAnimationFrame(this.tick);
    }
}

class Lights
{
    constructor(webgl, options)
    {
        this.webgl = webgl;
        this.options = options;
    }
    init()
    {
        const options = this.options;
        var curve = new THREE.LineCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -1)
        );
        var baseGeometry = new THREE.TubeBufferGeometry(curve, 25, 1, 8, false);
        var instanced = new THREE.InstancedBufferGeometry().copy(baseGeometry);
        instanced.maxInstancedCount = options.nLights;

        var colors = options.colors;
        if (Array.isArray(colors))
        {
            colors = colors.map(c => new THREE.Color(c));
        } else 
        {
            colors = new THREE.Color(colors);
        }

        var aOffset = [];
        var aMetrics = [];
        var aColor = [];

        var floorWidth = options.floorWidth;

        var lightCpt = 0;

        while (lightCpt < options.nLights)
        {
            var radius = Math.random() * 0.05 + 0.1;
            var length = Math.random() * options.length * 0.1 + options.length * 0.01;

            var floorX = floorWidth / 2;
            var offsetX = floorX - random(floorWidth);
            var offsetY = random(options.lightHeights);
            var offsetZ = -random(options.length);

            var speed = random(options.speed);

            var color = pickRandom(colors);
            if (Math.sqrt(offsetX * offsetX + offsetY * offsetY) > 4)
            {
                aOffset.push(offsetX);
                aOffset.push(offsetY);
                aOffset.push(offsetZ);

                aMetrics.push(radius);
                aMetrics.push(length);
                aMetrics.push(speed);

                aColor.push(color.r);
                aColor.push(color.g);
                aColor.push(color.b);

                lightCpt++;
            }
        }

        // Add the offset to the instanced geometry.
        instanced.setAttribute(
            "aOffset",
            new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false)
        );
        // Add the metrics to the instanced geometry.
        instanced.setAttribute(
            "aMetrics",
            new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false)
        );
        // Add the metrics to the instanced geometry.
        instanced.setAttribute(
            "aColor",
            new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false)
        );

        const material = new THREE.ShaderMaterial(
        {
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            transparent: true,
            uniforms: Object.assign(
                {
                    uTime: new THREE.Uniform(0),
                    uTravelLength: new THREE.Uniform(options.length),
                    uFade: new THREE.Uniform(new THREE.Vector2(1, 0 + options.fade))
                },
                this.webgl.fogUniforms
            )
        });
        var mesh = new THREE.Mesh(instanced, material);
        mesh.frustumCulled = false;
        this.mesh = mesh;
    
        this.webgl.scene.add(mesh);
    }
    update(time)
    {
        this.mesh.material.uniforms.uTime.value = time;
    }
}

const fragmentShader = 
`
#define USE_FOG;
${THREE.ShaderChunk["fog_pars_fragment"]}
varying vec3 vColor;
varying vec2 vUv; 
uniform vec2 uFade;
void main()
{
    vec3 color = vec3(vColor);
    float fadeStart = 0.4;
    float maxFade = 0.;
    float alpha = 1.;
    
    alpha = smoothstep(uFade.x, uFade.y, vUv.x);
    gl_FragColor = vec4(color,alpha);
    if (gl_FragColor.a < 0.0001) discard;
    ${THREE.ShaderChunk["fog_fragment"]}
}
`
;

const vertexShader = 
`
#define USE_FOG;
${THREE.ShaderChunk["fog_pars_vertex"]}
attribute vec3 aOffset;
attribute vec3 aMetrics;
attribute vec3 aColor;

uniform float uTravelLength;
uniform float uTime;
uniform float uSpeed;

varying vec2 vUv; 
varying vec3 vColor; 

void main()
{
    vec3 transformed = position.xyz;
    float radius = aMetrics.r;
    float myLength = aMetrics.g;
    float speed = aMetrics.b;

    transformed.xy *= radius ;
    transformed.z *= myLength;

    transformed.z += myLength-mod( uTime *speed + aOffset.z, uTravelLength);
    transformed.xy += aOffset.xy;

    vec4 mvPosition = modelViewMatrix * vec4(transformed,1.);
    gl_Position = projectionMatrix * mvPosition;
    vUv = uv;
    vColor = aColor;
    ${THREE.ShaderChunk["fog_vertex"]}
}`
;

function resizeRendererToDisplaySize(renderer)
{
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) 
    {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function random(base)
{
    if (Array.isArray(base))
    {
        return Math.random() * (base[1] - base[0]) + base[0];
    }
    return Math.random() * base;
}

function lerp(current, target, speed = 0.1, limit = 0.001)
{
    var change = (target - current) * speed;
    if (Math.abs(change) < limit)
    {
        change = target - current;
    }
    return change;
}

function pickRandom(arr)
{
    if (Array.isArray(arr)) return arr[Math.floor(Math.random() * arr.length)];
    return arr;
}

function lerp2(start, end, amt) {
    return (1-amt)*start+amt*end
}

function traverseChildren(elem){
    var children = [];
    var q = [];
    q.push(elem);
    while (q.length > 0)
    {
        var elem = q.pop();
        children.push(elem);
        pushAll(elem.children);
    }
    function pushAll(elemArray)
    {
        for(var i=0; i < elemArray.length; i++)
        {
        q.push(elemArray[i]);
        }
    }
    return children;
}