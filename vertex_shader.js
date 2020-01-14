var VSHADER_SOURCE = `
varying vec2 vUv;
uniform float time;
uniform float wave_s;
uniform float wave_p;
const float pi = 3.1415;
const float amplitude = 20.0;
const float wavelength = 10.0;
const float speed = 40.0;
const float PI = 3.14159265359;

const float A = 25.0;
const float lambda = 0.1;
const float w = 5.0;
const float freq = 4.5;


float waterSine(){
	float varx = floor(position.x)*0.5;
	float vary = floor(position.y)*0.5;
	float varz = floor(position.z)*0.5;

	float t = mod(time, 14.0) * 30.0;

	float periodo = 25.0;

	if(varx * varx + vary*vary > t*t ){
		 varx += t;
		 vary += t;
		 varz += t;
	}
	

	return A * exp(-lambda * time) * cos((varz/periodo));
}



void main(){
  vec3 newPosition = position;			 
	vUv = uv;
	float distance;
	
	distance = waterSine();
	newPosition.z = position.z + distance;

	vec4 mvPosition = modelViewMatrix * vec4( newPosition,1.0 );
	gl_Position = projectionMatrix * mvPosition;
}
`;