#version 330 core

// Interpolated values from the vertex shaders
// e.g.
in vec2 UV;
in vec3 posWorldspace;
in vec3 normalCameraspace;
in vec3 eyeDirectionCameraspace;
in vec3 lightDirectionCameraspace;



// Ouput data
out vec4 color;

// Values that stay constant for the whole mesh.
uniform sampler2D myTextureSampler;
uniform mat4 MV;
uniform vec3 lightPosWorldspace;

//WHAT I'M ADDING FOR LIGHT PROPERTIES:
uniform vec4 ambientMatColor;
uniform vec4 diffuseMatColor;
uniform vec4 specularMatColor;
uniform float specularExponentUniform;
uniform float opacityUniform;

//const float ns = 6.0; //specular exponent


void main(){

		color.a = opacityUniform;
		
		// Material properties
		vec3 textureVal = texture( myTextureSampler, UV ).rgb;

		vec3 ambientLightColor = vec3(1.0,1.0,1.0);
		vec3 diffuseLightColor = vec3(1.0,1.0,1.0);
		vec3 specularLightColor = vec3(1.0,1.0,1.0);


		// Distance to the light we could use this to diminish the amount of light the further away but we do not for simplification
		float distance = length( lightPosWorldspace - posWorldspace );
	
		// We now work in camera space
		// Normal of the computed fragment, in camera space
		vec3 N = normalize( normalCameraspace );
		// Direction of the light (from the fragment to the light) in camera space
		vec3 L = normalize( lightDirectionCameraspace );
	
		// We use the cosine of the angle theta between the normal and the light direction to compute the diffuse component.
		// The cosine is clamped to contrain it between 0 and 1
		//  - light is at the vertical of the triangle -> 1
		//  - light is perpendicular to the triangle -> 0
		//  - light is behind the triangle -> 0
		float cosTheta = clamp( dot( N,L), 0,1 );
	
		// Eye vector (towards the camera)
		vec3 E = normalize(eyeDirectionCameraspace);
		// Direction in which the triangle reflects the light
		vec3 R = reflect(-L,N);
	

		/*PHONG SHADING
		// Cosine of the angle between the Eye vector and the Reflect vector,
		// The cosine is clamped to contrain it between 0 and 1 to avoid negative values
		//  - Looking into the reflection -> 1
		//  - Looking elsewhere -> < 1
		//
		float cosAlpha = clamp( dot( E,R ), 0,1 );
		*/

		//BLINN PHONG
		vec3 H = normalize(E + L);	//adding the vector from the surface to the observer with the vector from the surface to the light source, normalising by dividng by magnitude
		float cosAlpha = clamp( dot( H,N ), 0, 1 );


		vec3 diffuseComponent = diffuseLightColor* diffuseMatColor.rgb * textureVal * cosTheta;
		vec3 ambientComponent = ambientLightColor * ambientMatColor.rgb * textureVal; //for simplification we reuse the diffuse texture map for the ambient texture map
		vec3 specularComponent = specularLightColor * specularMatColor.rgb  * pow(cosAlpha,specularExponentUniform);
    
		color.rgb =
		// Ambient : simulates indirect lighting
		ambientComponent + 
		// Diffuse : "color" of the object
		diffuseComponent +
		// Specular : reflective highlight, like a mirror
		specularComponent;



}
