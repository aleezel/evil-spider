import * as THREE from 'three';

export async function loadTexture(url) {
    const loader = new THREE.TextureLoader();
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            resolve,
            undefined, // Progress not supported
            reject
        );
    });
}

export async function loadMaterial(texture) {
    const material = new THREE.MeshStandardMaterial({ map: texture });
    return material
}