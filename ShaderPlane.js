 // File ShaderPlane.js
 
function draw_scene(){
	 
	  // Init the stats
	 
	stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	document.body.appendChild( stats.domElement );
	
 //Create the Three.js WebGL renderer
  
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( 1024, 768 ); 
  document.body.appendChild( renderer.domElement );
  renderer.setClearColor(0xEEEEEE);
  
  // Create the Three.js scene
  var scene = new THREE.Scene();
  
  // Create a camera and set it into world space
  // This camera will provide a perspective projection
  // Arguments are (fov, aspect, near_plane, far_plane)
  
  var camera = new THREE.PerspectiveCamera(75, 1024/768, 0.1, 3000);
	
	/* var mouseControls = new THREE.TrackballControls(camera, renderer.domElement);  //Adds control with mouse
	mouseControls.staticMoving = true;
  mouseControls.dynamicDampingFactor = 0.3; */
	
	// Alternative mouse controller
	var mouseControls = new THREE.OrbitControls( camera, renderer.domElement );
	mouseControls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	mouseControls.dampingFactor = 0.4;

	mouseControls.screenSpacePanning = false;

	//mouseControls.minDistance = 100;
	//mouseControls.maxDistance = 500;

	mouseControls.maxPolarAngle = Math.PI / 2;
	
	var clock = new THREE.Clock();
  
 var wichShader = VSHADER_SOURCE;

  var controls = new function(){
	  this.camerax = 200;
	  this.cameray = 400;
	  this.cameraz = 800;
		this.camerax_prev = 200;
		this.cameray_prev = 400;
		this.cameraz_prev = 800;
	  this.waveS = false;
	  this.waveP = false;
	  this.Change_direction= false;
		
		this.updateCamx = function (e){
	    camera.position.x = e;
		  camera.lookAt(scene.position);
	  }
	  this.updateCamy = function (e){
	    camera.position.y = e;
		  camera.lookAt(scene.position);
	  }
	  this.updateCamz = function (e){
	    camera.position.z = e;
		  camera.lookAt(scene.position);
	  }
	  
  }
  
  var geometry = new THREE.PlaneGeometry( 1000, 1000, 100, 100 );
  var geometry2 = new THREE.BoxGeometry(100,100,200,10,10,10);
	

	var uniforms1 = {
					resolution: { type:"v2", value:new THREE.Vector2(1024,768) },
					planesubdivs: { type:"v2", value:new THREE.Vector2(100,100) },
					time: { value: 1.0 },
					wave_s: { value: 0.0 },
					wave_p: { value: 0.0 }
				};
	
var material = new THREE.ShaderMaterial( {

						uniforms: uniforms1,
						vertexShader: VSHADER_SOURCE,
						fragmentShader: FSHADER_SOURCE
						} );

var material2 = new THREE.ShaderMaterial( {

						uniforms: uniforms1,
						vertexShader: VSHADER_SOURCE,
						fragmentShader: FSHADER_SOURCE
						} );
		
	
//   var material = new THREE.MeshBasicMaterial( {color: 0xffffff, vertexColors: THREE.VertexColors } );
	//material.side = THREE.FrontSide;  // Default value
	//material.side = THREE.BackSide;
	material.side = THREE.DoubleSide;
  var face = geometry.faces[0];
  face.vertexColors[0] = new THREE.Color( controls.color0);
  face.vertexColors[1] = new THREE.Color( controls.color1 );
  face.vertexColors[2] = new THREE.Color( controls.color2 );
  
  material.wireframe=true;
  material2.wireframe=true;
  var myPlane = new THREE.Mesh(geometry, material);
	myPlane.rotation.x = -Math.PI/2;
	//myPlane.position.set(200,200,100);
  scene.add(myPlane);

  var myBuilding = new THREE.Mesh(geometry2,material2);
  myBuilding.position.set(200,300,100);
  myBuilding.rotation.x=-Math.PI/2;
//  scene.add(myBuilding);

	
	var globalaxes = new THREE.AxesHelper( 1000 );
  scene.add(globalaxes);  // Global set of coordinate axis
	
	var localaxes = new THREE.AxesHelper( 200 );
  myPlane.add(localaxes); // Set of axis local to plane
	
	
	
	
	
	
		  
  var gui = new dat.GUI();
  var f1 = gui.addFolder('Camera');
	// Sliders to reposition camera
  var controlx = f1.add(controls, 'camerax', -3000,3000).onChange(controls.updateCamx); 
  var controly = f1.add(controls, 'cameray', -3000,3000).onChange(controls.updateCamy);
  var controlz = f1.add(controls, 'cameraz', -3000,3000).onChange(controls.updateCamz);
  
  var f2 = gui.addFolder('Waves');
  var ws = f2.add(controls,'waveS').onChange(render);
  var wp = f2.add(controls,'waveP').onChange(render);
  var cd = f2.add(controls,'Change_direction').onChange(render);
  
   
  f1.open();
  
	
	camera.position.set(controls.camerax,controls.cameray,controls.cameraz);  // Inits camera position
	camera.lookAt(scene.position);  // Camera will look to origin
  
 

 function render() {
		mouseControls.update(); // Effects control with mouse
		// Checks if camera position was changed through GUI
		if (controls.camerax_prev != camera.position.x){
		  controls.camerax = camera.position.x;
		  controls.camerax_prev = camera.position.x;
		  controlx.updateDisplay(); // Updates GUI if camera moved through mouse
	  }
	  if (controls.cameray_prev != camera.position.y){
		  controls.cameray = camera.position.y;
		  controls.cameray_prev = camera.position.y;
		  controly.updateDisplay();
	  }
		if (controls.cameraz_prev != camera.position.z){
			controls.cameraz = camera.position.z;
			controls.cameraz_prev = camera.position.z;
			controlz.updateDisplay();
		}
		

		if(controls.waveS==true && controls.waveP==true){
			uniforms1.wave_s.value=1.0;
			uniforms1.wave_p.value=1.0;
		}else if(controls.waveS==true){
			uniforms1.wave_s.value=1.0;
			uniforms1.wave_p.value=0.0;
		  }else if(controls.waveP==true){
			uniforms1.wave_s.value=0.0;
			uniforms1.wave_p.value=1.0;
		  }else{
			uniforms1.wave_s.value=0.0;
			uniforms1.wave_p.value=0.0;
		  }
	  var delta = clock.getDelta();
	  
		if(controls.Change_direction==false){
			uniforms1.time.value += delta * 2;
		}else{
			uniforms1.time.value -= delta * 2;
		}
		
		
    requestAnimationFrame( render );
    stats.update();
    renderer.render( scene, camera ); 
  } 

  render();  // Inits the loop
  //renderer.setAnimationLoop(render);
}
 
 