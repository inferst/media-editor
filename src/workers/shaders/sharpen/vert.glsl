attribute vec4 position;
// attribute vec2 inputTexCoord;
varying vec2 vTextureCoord;

// uniform highp float inputWidth;
// uniform highp float inputHeight;

uniform highp float width;
uniform highp float height;

varying vec2 leftTexCoord;
varying vec2 rightTexCoord;
varying vec2 topTexCoord;
varying vec2 bottomTexCoord;

void main() {
    gl_Position = position;
    // vTextureCoord = inputTexCoord;

    vTextureCoord = (position + 1.0) / 2.0;
    vTextureCoord.y = 1.0 - vTextureCoord.y;

    // highp vec2 widthStep = vec2(1.0 / inputWidth, 0.0);
    highp vec2 widthStep = vec2(1.0 / width, 0.0);
    // highp vec2 heightStep = vec2(0.0, 1.0 / inputHeight);
    highp vec2 heightStep = vec2(0.0, 1.0 / height);
    // leftTexCoord = inputTexCoord - widthStep;
    // rightTexCoord = inputTexCoord + widthStep;
    // topTexCoord = inputTexCoord + heightStep;
    // bottomTexCoord = inputTexCoord - heightStep;
    leftTexCoord = vTextureCoord - widthStep;
    rightTexCoord = vTextureCoord + widthStep;
    topTexCoord = vTextureCoord + heightStep;
    bottomTexCoord = vTextureCoord - heightStep;
};
