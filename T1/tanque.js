import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        SecondaryBox,        
        onWindowResize, 
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Use to scale the cube
var scale = 1.0;

// Show text information onscreen
showInformation();

// To use the keyboard
var keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(60, 40)
scene.add(plane);


   // create a cube
   const cubeGeometry = new THREE.BoxGeometry(3.25, 1.5, 2.5);
   const cube = new THREE.Mesh(cubeGeometry, material);
   // position the cube
   cube.position.set(0.0, 1.419, 0.0);
   // add the cube to the scene
   scene.add(cube);

   const geometry1 = new THREE.TorusGeometry( 0.45, 0.35, 30, 200 ); 
   const material1 = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
   const torus1 = new THREE.Mesh( geometry1, material1 ); 
   torus1.position.set(0.9, -0.72, 1.2);
   cube.add( torus1 );

   const geometry2 = new THREE.TorusGeometry( 0.45, 0.35, 30, 200  ); 
   const material2 = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
   const torus2 = new THREE.Mesh( geometry2, material2 ); 
   torus2.position.set(-0.9, -0.72, 1.2);
   cube.add( torus2 );

   const geometry3 = new THREE.TorusGeometry( 0.45, 0.35, 30, 200  ); 
   const material3 = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
   const torus3 = new THREE.Mesh( geometry3, material3 ); 
   torus3.position.set(-0.9, -0.72, -1.2);
   cube.add( torus3 );

   const geometry4 = new THREE.TorusGeometry( 0.45, 0.35, 30, 200  ); 
   const material4 = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
   const torus4 = new THREE.Mesh( geometry4, material4 ); 
   torus4.position.set(0.9, -0.72, -1.2);
   cube.add( torus4 );
  
   const cubeGeometry2 = new THREE.BoxGeometry(2.8, 0.5, 2.2);
   const cubomaterial2= setDefaultMaterial();
   const cube2 = new THREE.Mesh(cubeGeometry2, cubomaterial2);
   cube2.position.set(0.0, 1.0, 0.0);
   cube.add( cube2 );

   const sphGeo = new THREE.SphereGeometry(1, 20, 20);
   const sphere = new THREE.Mesh(sphGeo, material);
   sphere.position.set(0.0, 1.2, 0);
   cube.add(sphere);


   const canhaoGeometry = new THREE.CylinderGeometry( 0.25, 0.25, 2,); 
   const canhaomaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} ); 
   const canhao = new THREE.Mesh( canhaoGeometry, canhaomaterial ); 
   canhao.position.set(1.5, 0.5, 0.0);
   canhao.rotateX(THREE.MathUtils.degToRad(90));
   canhao.rotateZ(THREE.MathUtils.degToRad(90));
   sphere.add( canhao );

   
   cube.rotateY(THREE.MathUtils.degToRad(90));
   const cubeAxesHelper = new THREE.AxesHelper(9);
   cube.add(cubeAxesHelper);




var positionMessage = new SecondaryBox("");
positionMessage.changeStyle("rgba(0,0,0,0)", "lightgray", "16px", "ubuntu")

render();

function keyboardUpdate() {

   keyboard.update();
 
   if ( keyboard.pressed("up") )    cube.translateX(  1 );
   if ( keyboard.pressed("down") )  cube.translateX( -1 );
 
   var angle = THREE.MathUtils.degToRad(10);
   if ( keyboard.pressed("left") )  cube.rotateY(  angle );
   if ( keyboard.pressed("right") ) cube.rotateY( -angle );
 
 }


function showInformation()
{
  // Use this to show information onscreen
  var controls = new InfoBox();
    controls.add("Geometric Transformation");
    controls.addParagraph();
    controls.add("Use keyboard arrows to move the cube in XY.");
    controls.add("Press Page Up or Page down to move the cube over the Z axis");
    controls.add("Press 'A' and 'D' to rotate.");
    controls.add("Press 'W' and 'S' to change scale");
    controls.show();
}

function render()
{
  keyboardUpdate();
  requestAnimationFrame(render); // Show events
  renderer.render(scene, camera) // Render scene
}
