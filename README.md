# RenderEngine

A basic engine to render scenes using OpenGL. Largely adapted from the OpenGL basic tutorial series, with all of the shader GLSL files and corresponding C++ files written by me. Note that this engine uses assimp library for some basic operations. In particular, the method 'loadOBJMTL' is used the read mtl object files. This engine implements Blinn Phong shading to achieve realistic lighting, and a basic postEffect loop which can apply a Sobel of blur filter.
