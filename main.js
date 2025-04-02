document.addEventListener("DOMContentLoaded", function () {
    // Verificar que THREE existeccccccccccccccc
    if (typeof THREE === "undefined") {
        console.error("Three.js no se cargó. Revisa la URL en el Head.");
        return;
    }

    const canvas = document.getElementById("effects");
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1);
    camera.position.z = 1;
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    });
    renderer.setClearColor(0x000000, 0); // Transparent background

    renderer.setSize(window.innerWidth, window.innerHeight);

    // Asegúrate de incluir los shaders COMPLETOS (sin "...")
    const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }

    `;

    const fragmentShader = `
    float4 main(float2 tex : TEXCOORD0) : COLOR
    {
        // lens distortion coefficient (between
        float k = -0.15;
        // cubic distortion value
        float kcube = 0.5;
        float r2 = (tex.x-0.5)(tex.x-0.5) + (tex.y-0.5)(tex.y-0.5);
        float f = 0;
        if (kcube == 0.0) {
            f = 1 + r2 * k;
        } else {
            f = 1 + r2 * (k + kcube * sqrt(r2));
        };
        float x = f*(tex.x-0.5)+0.5;
        float y = f*(tex.y-0.5)+0.5;
        float3 inputDistord = tex2D(s0,float2(x,y));
        return float4(inputDistord.r,inputDistord.g,inputDistord.b,1);
    }
    `;

    // Load shaders
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            time: { value: 0 },
            k: { value: 0.2 },
            kcube: { value: 0.3 },
            scale: { value: 0.9 },
            dispersion: { value: 0.01 },
            blurAmount: { value: 0.02 },
            alpha: { value: 0.7 } // Adjust transparenc
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        depthWrite: false
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial);
    scene.add(quad);

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        shaderMaterial.uniforms.time.value += 0.01; // Animate if needed
        renderer.render(scene, camera);
    }
    animate();

});