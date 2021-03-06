//Dependencies Webpack  and threeJS, npm install webpack webpack-cli, npm install threeJS
// npm run-script build to compile, work on this file.
// dont change package.json
 

//Llamada de la librerias
const THREE = require('three');
// CommonJS:
const dat = require('dat.gui');
const Stats = require('stats.js');
 /*****************************START ADDED CODE***************/
      import { Examples, ParticleEngine } from 'js/ParticleEngine.js';
     /*****************************FINISH ADDED CODE**************/




import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//Model loaders
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
//Basis Texture loader
import { BasisTextureLoader } from 'three/examples/jsm/loaders/BasisTextureLoader.js';

import CameraControls from 'camera-controls';


// CameraControls.install( { THREE: THREE } );
const canvas = document.getElementById('canvas');
const clock = new THREE.Clock();
 // Optional: Pre-fetch Draco WASM/JS module.
// dracoLoader.preload();
//Scene and render
var renderer, scene, bgScene, camera, cameraControls;
var bgMesh;
var engine;
var controls;
var mixer, mixer2,mixerCap;
//Lights
var spotLight, light, hemisLight;
var spotLightHelper;
//Skybox
var materiall;
var Skybox;
var video=[];
//Interface
var gui;
var obj;
var stats;
var childd=[];
var childdd;
//DownLoader
var INTERSECTED = null;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2( Infinity, Infinity );
const group = [];
var Gltf_number=0;
var indexmodel=0;
function init() 
{
	
	//DAT GUI
	gui = new dat.gui.GUI();
	obj = {
		explode: function () {
		alert('Bang!');
		},
	
		//spotlight
		posX: -25, 
		posY: 8, 
		posZ: 7,
		colorL: "#ffffff", // RGB array
		penunmbra: 0.2,
		helpSpot:true,
		intSpot:1,
		
		intAmbien:1,
		color0: "#443333", 
		intHemis:1,
		colorg: "#111122", 
	};
	
	renderer = new THREE.WebGLRenderer({ canvas });
	scene = new THREE.Scene();
    // scene.fog = new THREE.Fog( 0x443333, 1, 4 );
 /*****************************START ADDED CODE***************/
       var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 2, FAR = 5000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
     /*****************************FINISH ADDED CODE**************/
		
	
	
	//Lights
	// spotLight = new THREE.SpotLight( 0xffff00 );
	light = new THREE.AmbientLight( obj.color0 ); // soft white light
	hemisLight = new THREE.HemisphereLight( obj.color0, obj.colorg, 1 );
	

	stats = new Stats();
}

function addLights() 
{
	
	//Hemisphere light
	scene.add( hemisLight );
	spotLight = new THREE.SpotLight();
    spotLight.angle = Math.PI / 16;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    spotLight.position.set( obj.posX, obj.posY, obj.posZ );
	scene.add( spotLight );
	spotLightHelper = new THREE.SpotLightHelper( spotLight );
	scene.add( spotLightHelper );
	//fireworklight
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
}

function addGUI() 
{
	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );
	var guiALL= gui.addFolder('Light');
	var guiSL = guiALL.addFolder('SpotLight');
	guiSL.add(obj, 'helpSpot').onChange(function (val) {
		spotLightHelper.visible = val;
	});
	guiSL.add(obj, 'posX').onChange(function (val) {
		spotLight.position.x = val;
		spotLightHelper.update();
	});
	guiSL.add(obj, 'posY').onChange(function (val) {
		spotLight.position.y = val;
		spotLightHelper.update();

	});
	guiSL.add(obj, 'posZ').onChange(function (val) {
		spotLight.position.z = val;
		spotLightHelper.update();

	});
	//Ambient Light
	var guiAL = guiALL.addFolder('AmbientLight');
	guiAL.addColor(obj, 'color0').onChange(function (val) {
		light.color.set(val);
		hemisLight.color.set(val);
	});
	guiAL.add(obj, 'intAmbien').min(0).max(1).step(0.1).onChange(function (val) {
		light.intensity = val;
	}).name('Intensity');

	//Hemisphere Light
	var guiHL = guiALL.addFolder('HemisphereLight');
	guiHL.addColor(obj, 'colorg').onChange(function (val) {
		hemisLight.groundColor.set(val);
	});
	guiHL.add(obj, 'intHemis').min(0).max(1).step(0.1).onChange(function (val) {
		hemisLight.intensity = val;
	}).name('Intensity');
	

	
}

function main() {

	
	//Renderer
	renderer.setClearColor(0x222222);
	renderer.autoClearColor = false;
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	//renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
   // renderer.shadowMap.enabled = true;
//	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
document.body.appendChild( renderer.domElement );
	//Camera
	camera.position.x = 14;
	camera.position.y = 2;
	camera.position.z = 6;
	camera.lookAt( 0, 0.1, 0 );
    controls = new OrbitControls( camera, renderer.domElement );

	addLights();

	//Models
	// loadDraco('model/draco/alocasia_s.drc');
	// loadGLTF('model/glb/Flamingo.glb', [-2, 2, 1], [0.01, 0.01, 0.01]);
	/// 
	
	
	loadGLTF('model/gltf/capoeira/Capoeira.gltf', [1, 0, 0], [0.01, 0.01, 0.01]).then(function(gltff){
		console.log('termine gltf!');
		//mixerCap = new THREE.AnimationMixer( gltff.scene );
		var action = mixerCap.clipAction( gltff.animations[ 0 ] );
		//action.play();
		//childd[0]=gltff.;// Downloader
		
	//	group[0]= gltff.scene.children[0];
	//	group[0].position.copy(position);
		
	}).catch(function (err) {
		console.log(err);
		
	});
	
	Gltf_number=1;

    loadGLTF('model/gltf/GLTFMATCAP/scene.gltf', [10, 0, 0], [0.1, 0.1, 0.1]).then(function(gltf){
		console.log('termine gltf!');
		//childd[Gltf_number]=gltf;// Downloader
		//group.add(  gltf.scene );
		//	group[1]= gltf.scene.children[0];
	//	group[1].position.copy(position);
	}).catch(function (err) {
		console.log(err);
	});
	
	Gltf_number=2;
	

	loadGLTF('model/gltf/miguelangelo/scene.gltf', [-10, 0, 0], [0.1, 0.1, 0.1]).then(function(gltf){
		console.log('termine gltf!');
		//childd[Gltf_number]=gltf;// Downloader
		//group.add(  gltf.scene );
		//group[2]= gltf.scene.children[0];
		//group[2].position.copy(position);
	}).catch(function (err) {
		console.log(err);
	});
	
	Gltf_number=3;	/**/


	loadFBX('model/fbx/avatar1.fbx', [2, 0, -1], [0.01, 0.01, 0.01]).then(function(obj1){
		// console.log('termine!');
		//mixer = new THREE.AnimationMixer( obj1 );
	//	var action = mixer.clipAction( obj1.animations[ 0 ] );
		//action.play();
	//	childd[3]=obj1;// Downloader
		// Downloader
			
		//group.add( obj1 );// Downloader
			
		//group.add( childd[2] );// Downloader
		
		//group.add( childd[3] );// Downloader
		//group[4]= obj1.scene.children[0];
		//group[4].position.copy(position);
	})
	
	loadModels();
	//*/
	 /*****************************START ADDED CODE***************/
	 
	 //create video
	 for (let index = 0; index < 3; index++) {
		 video[index]= document.createElement('video');
		 video[index].load();
		 video[index].autoplay= true;
		 video[index].needsUpdate= true;
		 video[index].loop	= true;
		
	 }
	 
	 
        var floorTexture = new THREE.TextureLoader().load( 'images/checkerboard.jpg' )
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	
	var plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 30, 30 ),
		new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010, map: floorTexture, side: THREE.DoubleSide} )
		);
    plane.rotation.x = - Math.PI / 2;
    plane.receiveShadow = true;
	scene.add( plane );




	
	//scene.add( group );

	//engine= new ParticleEngine();
	//engine.setValues(Examples.fountain);
	//engine.initialize(scene);
	//addSkybox(0,false);
//	addGUI();
	//addGUIFirework();
	//addGUISkybox();
//	addGUIChooseSkybox ();
     /*****************************FINISH ADDED CODE**************/
	 renderer.domElement.addEventListener( 'mousemove', onMouseMove );// Downloader
	 renderer.domElement.addEventListener( 'click', onMouseClick );
}
 /*****************************START ADDED CODE***************/
        function addGUISkybox(){//Create animated sky
	
	
	
	var guiSLSky = gui.addFolder('Skybox');
	guiSLSky.add(materiall, 'roughness').min(0).max(1).step(0.1).onChange(function (val) {
		materiall.roughness = val;
		//materiall.update();
	});
	guiSLSky.add(materiall, 'metalness').min(0).max(1).step(0.1).onChange(function (val) {
		materiall.metalness = val;
		//materiall.update();

	});
	

}
function addSkybox(num,	isnotfirsttime){//Create animated sky

	
	var texture;
	
	//choose the video
	if (num== 0){
		video[2].src	= "images/Lluvia.mp4";
		video[0].src	= "images/Sky.mp4";
		video[0].autoplay= true;	
		video[2].autoplay= true;
		 texture = new THREE.VideoTexture( video[0] );
	} 
	if (num== 1){
		video[1].autoplay= true;
		video[2].autoplay= true;
		video[2].src	= "images/Sky.mp4"; 
		video[1].src	= "images/Lluvia.mp4";
		 texture = new THREE.VideoTexture( video[1] );
	} 
	if (num==2){
		video[2].autoplay= true;
		video[2].src	= "images/Amanecer.mp4";
		 texture = new THREE.VideoTexture( video[2] );
		 
	} 
	
	
	
	

    var skyGeo;
    //add sphere
	skyGeo=	new THREE.SphereGeometry( 300, 30, 30 );
	
	//adding the video to the sphere
 	//var material = new THREE.MeshBasicMaterial({ map: texture,});
     materiall = new THREE.MeshStandardMaterial( {

    //color: 0xffffff,

    roughness: 1,
    metalness: 1,
    map: texture,

	} );
	if (isnotfirsttime){
		scene.remove( Skybox );
	}
	
	 Skybox = new THREE.Mesh(skyGeo, materiall);
	// put the video both sides of the sphere
	Skybox.material.side = THREE.DoubleSide;
	//Skybox.Side = THREE.DoubleSide;
	//add sky
	scene.add(Skybox);
	
}
     /*****************************FINISH ADDED CODE**************/

function restartEngine(parameters)
{
	//resetCamera();
	
	engine.destroy(scene);
	engine = new ParticleEngine();
	engine.setValues( parameters );
	engine.initialize(scene);
}
 /*****************************START ADDED CODE***************/
        
function addGUIFirework (){
	
	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );
	 var parameters = 
	{
		Downloader:   function() { download_image(); },
			
	};
	var guiALLF= gui.addFolder('File');
	guiALLF.add( parameters, 'Downloader'   ).name("Download");

}

function addGUIChooseSkybox (){
	var parameters = 
   {
	   blueSky:   function() { addSkybox( 0 , true  ); },
	   rain:   function() { addSkybox( 1 , true  ); },		
	   sunrise:   function() { addSkybox( 2 , true  ); }	
	
   };
   var guiALLF= gui.addFolder('Choose Sky');
   guiALLF.add( parameters, 'blueSky'   ).name("BlueSky");
   guiALLF.add( parameters, 'rain'   ).name("Rainning");
   guiALLF.add( parameters, 'sunrise'   ).name("Sunrise");

}
     /*****************************FINISH ADDED CODE**************/
function loadFBX(path,pos,scale) {
	const promise = new Promise(function (resolve, reject) {
		var loader = new FBXLoader();
		loader.load( path, function ( object ) {
	
			console.log(object);
			object.scale.set(scale[0], scale[1], scale[2]);
			object.position.set(pos[0], pos[1], pos[2]);
				
			object.traverse( function ( child ) {
				if ( child.isMesh ) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
				//childd[Gltf_number]=child;// Downloader
			} );
			scene.add( object );
			//childd[Gltf_number]=object;// Downloader
			console.log(object);
			if (object == null) {
				reject();
			}else{
				resolve(object);
			}
	
		} );
		
	})
	

	return promise;
}

function loadGLTF(path, pos,scale) {
	return new Promise((resolve, reject)=>{

		// Instantiate a loader
		var loader = new GLTFLoader();
	
		// Optional: Provide a DRACOLoader instance to decode compressed mesh data
		var dracoLoader = new DRACOLoader();
		// dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
		dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
		loader.setDRACOLoader( dracoLoader );
		
		// Load a glTF resource
		loader.load(
			// resource URL
			path,
			// called when the resource is loaded
			function ( gltf ) {
				//Transformations
				gltf.scene.scale.set(scale[0], scale[1], scale[2]);
				gltf.scene.position.set(pos[0], pos[1], pos[2]);
				gltf.scene.castShadow = true;
				gltf.scene.receiveShadow = true;
				
				gltf.scene.traverse( function ( child ) {
					if ( child.isMesh ) {
						child.castShadow = true;
						child.receiveShadow = true;
						
					

					}
					//childd[Gltf_number]=child;// Downloader
				} );
			
				//group.add(  gltf.scene );
				scene.add( gltf.scene );
				//group.add(  gltf.scene );
				group[Gltf_number]=gltf.scene.children[0];
				group[Gltf_number].position.copy(position);
				console.log(gltf);
				
				gltf.animations; // Array<THREE.AnimationClip>
				gltf.scene; // THREE.Group
				gltf.scenes; // Array<THREE.Group>
				gltf.cameras; // Array<THREE.Camera>
				gltf.asset; // Object
				
				resolve(gltf);
	
			},
			// called while loading is progressing
			function ( xhr ) {
	
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	
			},
			// called when loading has errors
			function ( error ) {
	
				console.log( 'An error happened' );
				reject(error);
			});	
	});
}
 /*****************************START ADDED CODE***************/
      
function addGUIGLTF(){//Create animated sky
	
	
	
	var guigltf = gui.addFolder('GLTF');
	guigltf.add(childdd.material, 'emissiveIntensity').min(0).max(1).step(0.1).onChange(function (val) {
		
		childd.traverse( function ( child ) {
					
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
			if(child instanceof THREE.Mesh){
				
				
				child.material.emissiveIntensity = val;
				
			}
		});
	}).name('Intensity');
	guigltf.addColor(childdd.material, 'emissive').onChange(function (val) {
		
		childd.traverse( function ( child ) {
					
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
			if(child instanceof THREE.Mesh){
				
				child.material.emissive=val;
				
			}
		});
	}).name('Emissive');

	
	guigltf.add(childdd.material, 'emissiveIntensity').min(0).max(1).step(0.1).onChange(function (val) {
		
		childd.traverse( function ( child ) {
					
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
			if(child instanceof THREE.Mesh){
				
				
				child.material.matcap = val;
			}
		});
	}).name('Map');
	
	
}

     /*****************************FINISH ADDED CODE**************/
function loadDraco(path) {
	var dracoLoader = new DRACOLoader();
	// It is recommended to always pull your Draco JavaScript and WASM decoders
	// from this URL. Users will benefit from having the Draco decoder in cache
	// as more sites start using the static URL.
	dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
	
	dracoLoader.setDecoderConfig( { type: 'js' } );

	dracoLoader.load( path, function ( geometry ) {

		geometry.computeVertexNormals();

		var material = new THREE.MeshStandardMaterial( { color: 0x606060 } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		// mesh.position.y = 0.3;
		scene.add( mesh );

		// Release decoder resources.
		dracoLoader.dispose();

	} );
}

function loadBasisTexture(path){
	return new Promise((resolve, reject)=>{
		var material = new THREE.MeshStandardMaterial();
		var loader = new BasisTextureLoader();
		loader.setTranscoderPath( 'js/libs/basis/' );
		loader.detectSupport( renderer );
		loader.load( path, function ( texture ) {
	
			texture.encoding = THREE.sRGBEncoding;
			material.map = texture;
			material.needsUpdate = true;
			resolve (material);
	
		}, undefined, function ( error ) {
			console.error( error );
			reject (error);
		} );
		
	})

}

function displayWindowSize(){
	// Get width and height of the window excluding scrollbars
	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;
	
	// Display result inside a div element
	// console.log("Width: " + w + ", " + "Height: " + h);
	renderer.setSize(w, h);
	// camera.fov = Math.atan(window.innerHeight / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}

// Attaching the event listener function to window's resize event
window.addEventListener("resize", displayWindowSize);
// document.addEventListener( 'keydown', onKeyDown, false );
// document.addEventListener( 'keyup', onKeyUp, false );

function animate() 
{
	
/*
	// const hasControlsUpdated = cameraControls.update( delta );
	requestAnimationFrame(animate);
	render();
	renderer.render(scene, camera);
	var dt = clock.getDelta();
	engine.update( dt * 0.5);
	controls.update();
	stats.update();	
	//controls.update();
	
   */
  requestAnimationFrame(animate);
  
  raycast();
  render();
  renderer.render(scene, camera);
  controls.update();
  stats.update();
  var dt = clock.getDelta();
  //engine.update( dt * 0.5);	
  //controls.update();
}


function render() 
{
	const delta = clock.getDelta();
	//Para la animacion
	if ( mixer ) mixer.update( delta );
	if ( mixer2 ) mixer2.update( delta );
	if ( mixerCap ) mixerCap.update( delta );
	
	
}
//------------------------------------------------------------download
function raycast() {
      
	raycaster.setFromCamera( mouse, camera );
	for (let indexmodel = 0; indexmodel < 3; indexmodel++) {
  var intersects = raycaster.intersectObjects( group[indexmodel] , true);
  
		  if ( intersects.length > 0 ) {
  
			  if ( INTERSECTED != intersects[ 1 ].object ) {
	
				  if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
	  
				  INTERSECTED = intersects[ 1 ].object;
				  INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
				  INTERSECTED.material.color.setHex( 0xd4d4d4 );
	  
			  }
	
		  } else {
  
			  if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
	
			  INTERSECTED = null;
	
		  }
		  //if(indexmodel==2){indexmodel=0;}
	}

}
function onMouseMove( event ) {
      
	event.preventDefault();
  
		  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onMouseClick( event ) {

	if ( INTERSECTED !== null ){	var link = document.createElement('a');
	link.download = "Lluvia.mp4";
	link.href = "images/Lluvia.mp4";
	link.click();
}

}
function download_image(){
	//	var file = new File(["aa"], "dek_iv.txt");
	//	file.
	//var canvas = document.getElementById("canvas");
	// var image = canvas.toDataURL("images/Lluvia.mp4");//.replace("image/png", "/images/lava.jpg");
	var link = document.createElement('a');
	link.download = "Lluvia.mp4";
	link.href = "images/Lluvia.mp4";
	link.click();


	}
	  
function loadModels() {

	const loader = new GLTFLoader();
	const onLoad = (gltf, position,path,name) => {
	
	  const model = gltf.scene.children[0];
	  model.position.copy(position);
	  const animation = gltf.animations[0];
	  const mixer = new THREE.AnimationMixer(model);
	 // mixers.push(mixer);
	 // const action = mixer.clipAction(animation);
	//  action.play();
	  scene.add(model);

	  var link = document.createElement('a');
	  link.download = name;
	  link.href = path;
	  
  
	  function clicked( event ) {
	  
		  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );
	  
		  var intersects = raycaster.intersectObject(model, true);
	  
		console.log(intersects.length)
  
		if (intersects.length > 0) {
			
		

		 
		  link.click();
		} else {
		
  
		  INTERSECTED = null;
		}
	  }
  
	  renderer.domElement.addEventListener('click', function(event) {
		// find intersections
  
		clicked(event);
		//camera.updateMatrixWorld();
  
  
	  });
  
	};
  
  
	const onProgress = () => {};
  
  
	const onError = (errorMessage) => {
	  console.log(errorMessage);
	};
  
  
	const parrotPosition = new THREE.Vector3(0, 0, 150);
	loader.load('https://threejs.org/examples/models/gltf/Parrot.glb', gltf => onLoad(gltf, parrotPosition, "images/Lluvia.mp4","Lluvia.mp4"), onProgress, onError);
  
	const flamingoPosition = new THREE.Vector3(7.5, 0, 200);
	loader.load('https://threejs.org/examples/models/gltf/Flamingo.glb', gltf => onLoad(gltf, flamingoPosition,"images/Sky.mp4","Sky.mp4"), onProgress, onError);
  
	const storkPosition = new THREE.Vector3(0, -2.5, 0);
	loader.load('https://threejs.org/examples/models/gltf/Stork.glb', gltf => onLoad(gltf, storkPosition,"images/Amanecer.mp4", "Amanecer.mp4"), onProgress, onError);
  
  }
  
init();
main();
animate();
