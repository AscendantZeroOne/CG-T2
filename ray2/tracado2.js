const scene = new THREE.Scene();

// Configuração da câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 200);
scene.add(camera);

// Configuração do renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('#canvas-container').appendChild(renderer.domElement);

// Luz
const lightPosition = new THREE.Vector3(100, 0, 100);

// Geometria da esfera
const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);

// Material com shaders personalizados
const sphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightPosition: { value: lightPosition },
        I_a: { value: 0.2 }, // Intensidade da luz ambiente
        I_l: { value: 1.0 }, // Intensidade da luz pontual
        Kd: { value: 0.8 }, // Coeficiente de difusão
        Ks: { value: 0.5 }, // Coeficiente especular
        Ka: { value: 0.5 }, // Coeficiente de ambiente
        K: { value: 1.0 },  // Fator de atenuação
        n: { value: 20.0 }  // Exponencial especular
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 lightPosition;
        uniform float I_a;
        uniform float I_l;
        uniform float Kd;
        uniform float Ks;
        uniform float Ka;
        uniform float K;
        uniform float n;

        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
            vec3 N = normalize(vNormal); // Normal do ponto
            vec3 L = normalize(lightPosition - vPosition); // Vetor luz
            vec3 V = normalize(-vPosition); // Vetor observador
            vec3 R = reflect(-L, N); // Reflexão da luz

            // Componentes de iluminação
            float cosTheta = max(dot(N, L), 0.0); // Difusão
            float cosAlpha = max(dot(R, V), 0.0); // Especular
            float distance = length(lightPosition - vPosition); // Distância até a luz
            float attenuation = 1.0 / (distance + K); // Atenuação

            // Intensidade de luz
            float ambient = I_a * Ka;
            float diffuse = I_l * Kd * cosTheta * attenuation;
            float specular = I_l * Ks * pow(cosAlpha, n) * attenuation;

            // Cor final
            vec3 color = vec3(1.0, 0.0, 1.0); // Cor base (magenta)
            vec3 intensity = (ambient + diffuse + specular) * color;

            gl_FragColor = vec4(intensity, 1.0);
        }
    `
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Animação
const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

// Iniciar animação
animate();
