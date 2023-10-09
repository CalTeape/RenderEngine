
#version 330 core

in vec2 UV;

out vec4 color;

uniform sampler2D renderedTexture;
uniform float time;
uniform float renderMode;


void sobelFilter(vec2 targetSize){
		vec4 top = texture(renderedTexture, vec2(UV.x, UV.y + 1.0/targetSize.y));
		vec4 bottom = texture(renderedTexture, vec2(UV.x, UV.y - 1.0/targetSize.y));

		vec4 left = texture(renderedTexture, vec2(UV.x-1.0/targetSize.x, UV.y));

		vec4 right = texture(renderedTexture, vec2(UV.x + 1.0/targetSize.x, UV.y));

		vec4 bottomLeft = texture(renderedTexture, vec2(UV.x - 1.0/targetSize.x, UV.y - 1.0/targetSize.y));

		vec4 bottomRight = texture(renderedTexture, vec2(UV.x + 1.0/targetSize.x, UV.y - 1.0/targetSize.y));

		vec4 topLeft = texture(renderedTexture, vec2(UV.x - 1.0/targetSize.x, UV.y + 1.0/targetSize.y));

		vec4 topRight = texture(renderedTexture, vec2(UV.x + 1.0/targetSize.x, UV.y + 1.0/targetSize.y));
		
		vec4 sx = -topLeft - 2*left - bottomLeft + topRight + 2*right + bottomRight;

		vec4 sy = -topLeft - 2*top - topRight + bottomLeft + 2*bottom + bottomRight;

		color = sqrt(sx*sx + sy*sy);
		color.a = 1.0;

}

void blurFilter(vec2 targetSize){
	float blurSizeH = 1.0/targetSize.x;
	float blurSizeV = 1.0/targetSize.y;

	vec4 sum = vec4(0.0);

	for(int x  = -4 ; x <= 4; x++){
		for(int y = -4; y <= 4; y++){
			sum += texture(renderedTexture, vec2(UV.x + x*blurSizeH, UV.y + y*blurSizeV))/81.0;
		}
	}
	color = sum;
	color.a = 1.0;
}


void main(){
	vec2 targetSize = vec2 ( 1024 , 768 ) ;

	if(renderMode == 1){
		sobelFilter(targetSize);
	}
	else if(renderMode == 2){
		blurFilter(targetSize);
	}
	else{	//default value, just going to give back unmodified uv coordinates on texture map
		color = texture(renderedTexture, vec2(UV.x, UV.y));
		color.a = 1.0;
	}
}