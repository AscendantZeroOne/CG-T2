// Configuração da cena
const scene = new THREE.Scene();

// Configuração da câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 100);

// Configuração do renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('#canvas-container').appendChild(renderer.domElement);

// Fonte de luz
const light = new THREE.PointLight(0xffffff, 1, 500);
light.position.set(100, 0, 100);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiente
scene.add(ambientLight);

// Esfera
const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0xff00ff,
    shininess: 100,
    specular: 0xffffff,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 0);
scene.add(sphere);

// Plano
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
    shininess: 10,
    specular: 0x404040,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, -50, 0);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Função de animação
const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

// Iniciar a animação
animate();
