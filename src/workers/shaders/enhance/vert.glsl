varying vec2 vTextureCoord;
attribute vec2 position;

void main() {
    vTextureCoord = (position + 1.0) / 2.0;
    vTextureCoord.y = 1.0 - vTextureCoord.y;
    gl_Position = vec4(position, 0, 1.0);
}
