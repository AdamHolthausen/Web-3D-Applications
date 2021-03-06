// import { GLTFLoader } from "./gltfloader";
import * as THREE from 'three';
import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

function traverseMaterials (object, callback) {
	object.traverse((node) => {
		if (!node.isMesh) return;
		const materials = Array.isArray(node.material)
			? node.material
			: [node.material];
		materials.forEach(callback);
	});
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 70, 1.25, 0.1, 1000 );
camera.position.set(30,30,30);
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize( 400, 400 );

document.querySelector("#model").appendChild(renderer.domElement);
const loader = new GLTFLoader();
let obj;
let fileName = document.getElementById("model").classList[1];
loader.load(`./models/${fileName}.glb`, gltf =>
{
	obj = gltf.scene;
	scene.add(obj);
}, undefined, error =>
{
	console.error(error);
})
scene.background = new THREE.Color(0xc6cccc);
scene.add( new THREE.AmbientLight( 0x222222 ) );
const light = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
scene.add(light);
renderer.outputEncoding = THREE.sRGBEncoding;
traverseMaterials(scene, (material) => {
	if (material.map) material.map.encoding = THREE.sRGBEncoding;
	if (material.emissiveMap) material.emissiveMap.encoding = THREE.sRGBEncoding;
	if (material.map || material.emissiveMap) material.needsUpdate = true;
});
function animate()
{
	requestAnimationFrame(animate);
	// camera.rotation.y += 0.01;
	renderer.render(scene, camera);
}
animate();
