precision highp float;
varying highp vec2 vTextureCoord;
uniform sampler2D textureSampler;

uniform lowp float contrast;
uniform lowp float warmth;
uniform lowp float grain;
uniform lowp float highlights;
uniform lowp float vignette;
uniform lowp float shadows;
uniform lowp float fade;
uniform lowp float saturation;

// Grain
uniform highp float width;
uniform highp float height;

const mediump vec3 hsLuminanceWeighting = vec3(0.3, 0.3, 0.3);
const mediump vec3 satLuminanceWeighting = vec3(0.2126, 0.7152, 0.0722);

const lowp float permTexUnit = 1.0 / 256.0;
const lowp float permTexUnitHalf = 0.5 / 256.0;
const lowp float grainsize = 2.3;

highp float getLuma(highp vec3 rgbP) {
    return (0.299 * rgbP.r) + (0.587 * rgbP.g) + (0.114 * rgbP.b);
}

highp vec3 rgbToYuv(highp vec3 inP) {
    highp float luma = getLuma(inP);
    return vec3(luma, (1.0 / 1.772) * (inP.b - luma), (1.0 / 1.402) * (inP.r - luma));
}

lowp vec3 yuvToRgb(highp vec3 inP) {
    return vec3(1.402 * inP.b + inP.r, (inP.r - (0.299 * 1.402 / 0.587) * inP.b - (0.114 * 1.772 / 0.587) * inP.g), 1.772 * inP.g + inP.r);
}

lowp float easeInOutSigmoid(lowp float value, lowp float strength) {
    if (value > 0.5) {
        return 1.0 - pow(2.0 - 2.0 * value, 1.0 / (1.0 - strength)) * 0.5;
    } else {
        return pow(2.0 * value, 1.0 / (1.0 - strength)) * 0.5;
    }
}

highp vec4 rnm(in highp vec2 tc) {
    highp float noise = sin(dot(tc, vec2(12.9898, 78.233))) * 43758.5453;
    return vec4(fract(noise), fract(noise * 1.2154), fract(noise * 1.3453), fract(noise * 1.3647)) * 2.0 - 1.0;
}

highp float getFade(in highp float t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

highp float pnoise3D(in highp vec3 p) {
    highp vec3 pi = permTexUnit * floor(p) + permTexUnitHalf;
    highp vec3 pf = fract(p);
    highp float perm = rnm(pi.xy).a;
    highp float n000 = dot(rnm(vec2(perm, pi.z)).rgb * 4.0 - 1.0, pf);
    highp float n001 = dot(rnm(vec2(perm, pi.z + permTexUnit)).rgb * 4.0 - 1.0, pf - vec3(0.0, 0.0, 1.0));
    perm = rnm(pi.xy + vec2(0.0, permTexUnit)).a;
    highp float n010 = dot(rnm(vec2(perm, pi.z)).rgb * 4.0 - 1.0, pf - vec3(0.0, 1.0, 0.0));
    highp float n011 = dot(rnm(vec2(perm, pi.z + permTexUnit)).rgb * 4.0 - 1.0, pf - vec3(0.0, 1.0, 1.0));
    perm = rnm(pi.xy + vec2(permTexUnit, 0.0)).a;
    highp float n100 = dot(rnm(vec2(perm, pi.z)).rgb * 4.0 - 1.0, pf - vec3(1.0, 0.0, 0.0));
    highp float n101 = dot(rnm(vec2(perm, pi.z + permTexUnit)).rgb * 4.0 - 1.0, pf - vec3(1.0, 0.0, 1.0));
    perm = rnm(pi.xy + vec2(permTexUnit, permTexUnit)).a;
    highp float n110 = dot(rnm(vec2(perm, pi.z)).rgb * 4.0 - 1.0, pf - vec3(1.0, 1.0, 0.0));
    highp float n111 = dot(rnm(vec2(perm, pi.z + permTexUnit)).rgb * 4.0 - 1.0, pf - vec3(1.0, 1.0, 1.0));
    highp vec4 n_x = mix(vec4(n000, n001, n010, n011), vec4(n100, n101, n110, n111), getFade(pf.x));
    highp vec2 n_xy = mix(n_x.xy, n_x.zw, getFade(pf.y));
    return mix(n_xy.x, n_xy.y, getFade(pf.z));
}

lowp vec2 coordRot(in lowp vec2 tc, in lowp float angle) {
    return vec2(((tc.x * 2.0 - 1.0) * cos(angle) - (tc.y * 2.0 - 1.0) * sin(angle)) * 0.5 + 0.5, ((tc.y * 2.0 - 1.0) * cos(angle) + (tc.x * 2.0 - 1.0) * sin(angle)) * 0.5 + 0.5);
}

highp vec3 fadeAdjust(highp vec3 color, highp float fadeVal) {
    return (color * (1.0 - fadeVal)) + ((color + (vec3(-0.9772) * pow(vec3(color), vec3(3.0)) + vec3(1.708) * pow(vec3(color), vec3(2.0)) + vec3(-0.1603) * vec3(color) + vec3(0.2878) - color * vec3(0.9))) * fadeVal);
}

void main() {
    vec4 source = texture2D(textureSampler, vTextureCoord);
    vec4 result = source;
    const lowp float toolEpsilon = 0.005;

    // if (skipTone < toolEpsilon) {
    //     result = vec4(applyRGBCurve(hslToRgb(applyLuminanceCurve(rgbToHsl(result.rgb)))), result.a);
    // }

    mediump float hsLuminance = dot(result.rgb, hsLuminanceWeighting);
    mediump float shadow = clamp((pow(hsLuminance, 1.0 / shadows) + (-0.76) * pow(hsLuminance, 2.0 / shadows)) - hsLuminance, 0.0, 1.0);
    mediump float highlight = clamp((1.0 - (pow(1.0 - hsLuminance, 1.0 / (2.0 - highlights)) + (-0.8) * pow(1.0 - hsLuminance, 2.0 / (2.0 - highlights)))) - hsLuminance, -1.0, 0.0);
    lowp vec3 hsresult = vec3(0.0, 0.0, 0.0) + ((hsLuminance + shadow + highlight) - 0.0) * ((result.rgb - vec3(0.0, 0.0, 0.0)) / (hsLuminance - 0.0));
    mediump float contrastedLuminance = ((hsLuminance - 0.5) * 1.5) + 0.5;
    mediump float whiteInterp = contrastedLuminance * contrastedLuminance * contrastedLuminance;
    mediump float whiteTarget = clamp(highlights, 1.0, 2.0) - 1.0;
    hsresult = mix(hsresult, vec3(1.0), whiteInterp * whiteTarget);
    mediump float invContrastedLuminance = 1.0 - contrastedLuminance;
    mediump float blackInterp = invContrastedLuminance * invContrastedLuminance * invContrastedLuminance;
    mediump float blackTarget = 1.0 - clamp(shadows, 0.0, 1.0);
    hsresult = mix(hsresult, vec3(0.0), blackInterp * blackTarget);
    result = vec4(hsresult.rgb, result.a);
    result = vec4(clamp(((result.rgb - vec3(0.5)) * contrast + vec3(0.5)), 0.0, 1.0), result.a);

    if (abs(fade) > toolEpsilon) {
        result.rgb = fadeAdjust(result.rgb, fade);
    }

    lowp float satLuminance = dot(result.rgb, satLuminanceWeighting);
    lowp vec3 greyScaleColor = vec3(satLuminance);
    result = vec4(clamp(mix(greyScaleColor, result.rgb, saturation), 0.0, 1.0), result.a);

    if (abs(warmth) > toolEpsilon) {
        highp vec3 yuvVec;
        if (warmth > 0.0) {
            yuvVec = vec3(0.1765, -0.1255, 0.0902);
        } else {
            yuvVec = -vec3(0.0588, 0.1569, -0.1255);
        }
        highp vec3 yuvColor = rgbToYuv(result.rgb);
        highp float luma = yuvColor.r;
        highp float curveScale = sin(luma * 3.14159);
        yuvColor += 0.375 * warmth * curveScale * yuvVec;
        result.rgb = yuvToRgb(yuvColor);
    }

    if (abs(grain) > toolEpsilon) {
        highp vec3 rotOffset = vec3(1.425, 3.892, 5.835);
        highp vec2 rotCoordsR = coordRot(vTextureCoord, rotOffset.x);
        highp vec3 noise = vec3(pnoise3D(vec3(rotCoordsR * vec2(width / grainsize, height / grainsize), 0.0)));
        lowp vec3 lumcoeff = vec3(0.299, 0.587, 0.114);
        lowp float luminance = dot(result.rgb, lumcoeff);
        lowp float lum = smoothstep(0.2, 0.0, luminance);
        lum += luminance;
        noise = mix(noise, vec3(0.0), pow(lum, 4.0));
        result.rgb = result.rgb + noise * grain;
    }

    if (abs(vignette) > toolEpsilon) {
        const lowp float midpoint = 0.7;
        const lowp float fuzziness = 0.62;
        lowp float radDist = length(vTextureCoord - 0.5) / sqrt(0.5);
        lowp float mag = easeInOutSigmoid(radDist * midpoint, fuzziness) * vignette * 0.645;
        result.rgb = mix(pow(result.rgb, vec3(1.0 / (1.0 - mag))), vec3(0.0), mag * mag);
    }

    gl_FragColor = result;
}
