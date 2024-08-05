precision highp float;
varying vec2 vTextureCoord;
varying vec2 leftTexCoord;
varying vec2 rightTexCoord;
varying vec2 topTexCoord;
varying vec2 bottomTexCoord;
uniform sampler2D sTexture;
uniform float sharpen;

void main() {
    vec4 result = texture2D(sTexture, vTextureCoord);

    vec3 leftTextureColor = texture2D(sTexture, leftTexCoord).rgb;
    vec3 rightTextureColor = texture2D(sTexture, rightTexCoord).rgb;
    vec3 topTextureColor = texture2D(sTexture, topTexCoord).rgb;
    vec3 bottomTextureColor = texture2D(sTexture, bottomTexCoord).rgb;

    result.rgb = result.rgb * (1.0 + 4.0 * sharpen) - (leftTextureColor + rightTextureColor + topTextureColor + bottomTextureColor) * sharpen;

    gl_FragColor = result;
}
