
#include "MTLShader.hpp"
// complete the setters with the appropriate method for passing information to the shaders
#include "Texture.hpp"
#include <iostream>

MTLShader::MTLShader(){

}

// version of constructor that allows for  vertex and fragment shader with differnt names

MTLShader::MTLShader(std::string vertexshaderName, std::string fragmentshaderName): Shader(vertexshaderName, fragmentshaderName){

    setUpShaderParameters();

}

// version of constructor that assumes that vertex and fragment shader have same name
MTLShader::MTLShader(std::string shaderName): Shader(shaderName){

    setUpShaderParameters();

}

MTLShader::~MTLShader(){
    glDeleteTextures(1, &m_TextureID);

}

void MTLShader::setUpShaderParameters(){

    m_TextureID  = glGetUniformLocation(programID, "myTextureSampler");
    m_ambientColor = glm::vec4(1.0);    //default value
    m_diffuseColor = glm::vec4(1.0);    //default value
    m_specularColor = glm::vec4(1.0);    //default value
    GLint ambientColorID = glGetUniformLocation(programID, "ambientMatColor");
    glProgramUniform4fv(programID,ambientColorID,1, &m_ambientColor[0]);
    //glUniform3f(ambientColorID, m_ambientColor.x, m_ambientColor.y, m_ambientColor.z);
    GLint diffuseColorID = glGetUniformLocation(programID, "diffuseMatColor");
    glProgramUniform4fv(programID,diffuseColorID,1, &m_diffuseColor[0]);
    //glUniform3f(diffuseColorID, m_diffuseColor.x, m_diffuseColor.y, m_diffuseColor.z);
    GLint specularColorID = glGetUniformLocation(programID, "specularMatColor");
    glProgramUniform4fv(programID,specularColorID,1, &m_specularColor[0]);
    //glUniform3f(specularColorID, m_specularColor.x, m_specularColor.y, m_specularColor.z);
    m_lightPos = glm::vec3(1,0,0);      //default value
    m_lightPosID = glGetUniformLocation(programID, "LightPosWorldspace");
    glProgramUniform3f(programID, m_lightPosID, m_lightPos.x, m_lightPos.y, m_lightPos.z);

    m_texture =NULL;
}

void MTLShader::setTexture(Texture* texture){
    m_texture = texture;
    // Get a handle for our "myTextureSampler" uniform
	m_TextureID  = glGetUniformLocation(programID, "myTextureSampler");

}


void MTLShader::setLightPos(glm::vec3 lightPos){
    m_lightPosID = glGetUniformLocation(programID, "LightPosWorldspace");
    glUniform3f(m_lightPosID, lightPos.x, lightPos.y, lightPos.z);

}

void MTLShader::setDiffuse(glm::vec3 diffuse){

    m_diffuseColor= glm::vec4(diffuse[0],diffuse[1],diffuse[2],1.0);
    GLint diffuseColorID = glGetUniformLocation(programID, "diffuseMatColor");
    glProgramUniform4fv(programID,diffuseColorID,1, &m_diffuseColor[0]);
}
void MTLShader::setAmbient(glm::vec3 ambient){

    m_ambientColor= glm::vec4(ambient[0],ambient[1],ambient[2],1.0);
    GLint ambientColorID = glGetUniformLocation(programID, "ambientMatColor");
    glProgramUniform4fv(programID, ambientColorID, 1, &m_ambientColor[0]);

}
void MTLShader::setSpecular(glm::vec3 specular){

    m_specularColor= glm::vec4(specular[0],specular[1],specular[2],1.0);
    GLint specularColorID = glGetUniformLocation(programID, "specularMatColor");
    glProgramUniform4fv(programID, specularColorID, 1, &m_specularColor[0]);
}

void MTLShader::setSpecularExponent(float exponent) {

    m_specularExponent = exponent;
    std::cout << m_specularExponent << std::endl;
    GLint specularExponentID = glGetUniformLocation(programID, "specularExponentUniform");
    glProgramUniform1f(programID, specularExponentID, m_specularExponent);

}

void MTLShader::setOpacity(float opacity){

    m_opacity= opacity;
    std::cout << m_opacity << std::endl;
    GLint opacityID = glGetUniformLocation(programID, "opacityUniform");
    glProgramUniform1f(programID, opacityID, m_opacity);
}


void MTLShader::bind(){
    // Use our shader
    glUseProgram(programID);
    // Bind our texture in Texture Unit 0
    if(m_texture!=NULL){
        m_texture->bindTexture();
        // Set our "myTextureSampler" sampler to user Texture Unit 0 using glUniform1i

    }

}
