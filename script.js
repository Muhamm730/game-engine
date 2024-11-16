// script.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Load ground texture
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('path/to/your/ground_texture.jpg'); // Replace with your texture path
groundTexture.wrapS = THREE.RepeatWrapping; // Repeat the texture
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(20, 20); // Scale the texture
const groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture }); // Use texture on ground

// Create ground
const groundGeometry = new THREE.PlaneGeometry(200, 200);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / 2; // Rotate to lay flat
scene.add(ground);

// Array to hold trees
const trees = [];

// Create mountains
function createMountain(x, z, height) {
  const mountainGeometry = new THREE.ConeGeometry(5, height, 4);
  const mountainMaterial = new THREE.MeshBasicMaterial({ color: 0x8B7765 }); // Solid brown color
  const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
  mountain.position.set(x, height / 2, z);
  scene.add(mountain);
}

createMountain(-50, -50, 30);
createMountain(50, -30, 40);
createMountain(-70, 50, 20);
createMountain(70, 30, 25);

// Create a tree and add it to the scene
function createTree(x, z) {
  const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5);
  const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Solid brown for trunk
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, 2.5, z);
  scene.add(trunk);

  const foliageGeometry = new THREE.SphereGeometry(3);
  const foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 }); // Solid green for foliage
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
  foliage.position.set(x, 6, z);
  scene.add(foliage);

  // Store the tree in the array
  trees.push({ trunk, foliage });
}

// Create initial trees
createTree(-10, -10);
createTree(15, 5);
createTree(20, -20);
createTree(-20, 15);
createTree(-5, 10);
createTree(30, -5);
createTree(25, 25);
createTree(-15, -25);
createTree(-30, -30);

// Create player character
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Solid red color
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 1; // Position above the ground
scene.add(player);

// Set camera position
camera.position.set(0, 1.5, 5); // Position camera at the player's eye level
camera.lookAt(player.position); // Look at the player

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Create a sun-like directional light
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(50, 50, 50); // Position the light in the sky
scene.add(sunLight);

// User controls
const controls = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

const playerSpeed = 0.2; // Increased player speed

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case 'w':
      controls.forward = true;
      break;
    case 's':
      controls.backward = true;
      break;
    case 'a':
      controls.left = true;
      break;
    case 'd':
      controls.right = true;
      break;
    case 'e': // Key to break the tree
      breakTree(); // Call function to break the tree
      break;
    case 'r': // Key to place a new tree
      placeTree(); // Call function to place a tree
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case 'w':
      controls.forward = false;
      break;
    case 's':
      controls.backward = false;
      break;
    case 'a':
      controls.left = false;
      break;
    case 'd':
      controls.right = false;
      break;
  }
});

// Function to break trees
function breakTree() {
  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i];
    const distance = player.position.distanceTo(tree.trunk.position);
    if (distance < 3) { // Check if the player is close enough to the tree
      scene.remove(tree.trunk);
      scene.remove(tree.foliage);
      trees.splice(i, 1); // Remove the tree from the array
      break; // Exit loop after breaking one tree
    }
  }
}

// Function to place trees
function placeTree() {
  // Get player's current position
  const playerPosition = player.position.clone();
  
  // Place the tree slightly above the ground
  createTree(playerPosition.x, playerPosition.z);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Move player based on user input
  if (controls.forward) player.position.z -= playerSpeed;
  if (controls.backward) player.position.z += playerSpeed;
  if (controls.left) player.position.x -= playerSpeed;
  if (controls.right) player.position.x += playerSpeed;

  // Update camera to follow the player
  camera.position.set(player.position.x, player.position.y + 1.5, player.position.z + 5); // Adjust camera position
  camera.lookAt(player.position); // Keep looking at the player

  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
