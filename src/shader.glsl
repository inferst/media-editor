varying highp vec2 vTextureCoord;
uniform sampler2D sTexture;
uniform highp float width;
uniform highp float height;
uniform sampler2D curvesImage;
uniform lowp float skipTone;
uniform lowp float shadows;
const mediump vec3 hsLuminanceWeighting = vec3(0.3, 0.3, 0.3);
uniform lowp float highlights;
uniform lowp float contrast;
uniform lowp float fadeAmount;
const mediump vec3 satLuminanceWeighting = vec3(0.2126, 0.7152, 0.0722);
uniform lowp float saturation;
uniform lowp float shadowsTintIntensity;
uniform lowp float highlightsTintIntensity;
uniform lowp vec3 shadowsTintColor;
uniform lowp vec3 highlightsTintColor;
uniform lowp float exposure;
uniform lowp float warmth;
uniform lowp float grain;
const lowp float permTexUnit = 1.0 / 256.0;
const lowp float permTexUnitHalf = 0.5 / 256.0;
const lowp float grainsize = 2.3;
uniform lowp float vignette;
highp float getLuma(highp vec3 rgbP) {
    return (0.299 * rgbP.r) + (0.587 * rgbP.g) + (0.114 * rgbP.b);
}
lowp vec3 rgbToHsv(lowp vec3 c) {
    highp vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    highp vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
    highp vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
    highp float d = q.x - min(q.w, q.y);
    highp float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
lowp vec3 hsvToRgb(lowp vec3 c) {
    highp vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    highp vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
highp vec3 rgbToHsl(highp vec3 color) {
    highp vec3 hsl;
    highp float fmin = min(min(color.r, color.g), color.b);
    highp float fmax = max(max(color.r, color.g), color.b);
    highp float delta = fmax - fmin;
    hsl.z = (fmax + fmin) / 2.0;
    if (delta == 0.0) {
        hsl.x = 0.0;
        hsl.y = 0.0;
    } else {
        if (hsl.z < 0.5) {
            hsl.y = delta / (fmax + fmin);
        } else {
            hsl.y = delta / (2.0 - fmax - fmin);
        }
        highp float deltaR = (((fmax - color.r) / 6.0) + (delta / 2.0)) / delta;
        highp float deltaG = (((fmax - color.g) / 6.0) + (delta / 2.0)) / delta;
        highp float deltaB = (((fmax - color.b) / 6.0) + (delta / 2.0)) / delta;
        if (color.r == fmax) {
            hsl.x = deltaB - deltaG;
        } else if (color.g == fmax) {
            hsl.x = (1.0 / 3.0) + deltaR - deltaB;
        } else if (color.b == fmax) {
            hsl.x = (2.0 / 3.0) + deltaG - deltaR;
        }
        if (hsl.x < 0.0) {
            hsl.x += 1.0;
        } else if (hsl.x > 1.0) {
            hsl.x -= 1.0;
        }
    }
    return hsl;
}
highp float hueToRgb(highp float f1, highp float f2, highp float hue) {
    if (hue < 0.0) {
        hue += 1.0;
    } else if (hue > 1.0) {
        hue -= 1.0;
    }
    highp float res;
    if ((6.0 * hue) < 1.0) {
        res = f1 + (f2 - f1) * 6.0 * hue;
    } else if ((2.0 * hue) < 1.0) {
        res = f2;
    } else if ((3.0 * hue) < 2.0) {
        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    } else {
        res = f1;
    }
    return res;
}
highp vec3 hslToRgb(highp vec3 hsl) {
    if (hsl.y == 0.0) {
        return vec3(hsl.z);
    } else {
        highp float f2;
        if (hsl.z < 0.5) {
            f2 = hsl.z * (1.0 + hsl.y);
        } else {
            f2 = (hsl.z + hsl.y) - (hsl.y * hsl.z);
        }
        highp float f1 = 2.0 * hsl.z - f2;
        return vec3(hueToRgb(f1, f2, hsl.x + (1.0 / 3.0)), hueToRgb(f1, f2, hsl.x), hueToRgb(f1, f2, hsl.x - (1.0 / 3.0)));
    }
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
lowp vec3 applyLuminanceCurve(lowp vec3 pixel) {
    highp float index = floor(clamp(pixel.z / (1.0 / 200.0), 0.0, 199.0));
    pixel.y = mix(0.0, pixel.y, smoothstep(0.0, 0.1, pixel.z) * (1.0 - smoothstep(0.8, 1.0, pixel.z)));
    pixel.z = texture2D(curvesImage, vec2(1.0 / 200.0 * index, 0)).a;
    return pixel;
}
lowp vec3 applyRGBCurve(lowp vec3 pixel) {
    highp float index = floor(clamp(pixel.r / (1.0 / 200.0), 0.0, 199.0));
    pixel.r = texture2D(curvesImage, vec2(1.0 / 200.0 * index, 0)).r;
    index = floor(clamp(pixel.g / (1.0 / 200.0), 0.0, 199.0));
    pixel.g = clamp(texture2D(curvesImage, vec2(1.0 / 200.0 * index, 0)).g, 0.0, 1.0);
    index = floor(clamp(pixel.b / (1.0 / 200.0), 0.0, 199.0));
    pixel.b = clamp(texture2D(curvesImage, vec2(1.0 / 200.0 * index, 0)).b, 0.0, 1.0);
    return pixel;
}
highp vec3 fadeAdjust(highp vec3 color, highp float fadeVal) {
    return (color * (1.0 - fadeVal)) + ((color + (vec3(-0.9772) * pow(vec3(color), vec3(3.0)) + vec3(1.708) * pow(vec3(color), vec3(2.0)) + vec3(-0.1603) * vec3(color) + vec3(0.2878) - color * vec3(0.9))) * fadeVal);
}
lowp vec3 tintRaiseShadowsCurve(lowp vec3 color) {
    return vec3(-0.003671) * pow(color, vec3(3.0)) + vec3(0.3842) * pow(color, vec3(2.0)) + vec3(0.3764) * color + vec3(0.2515);
}
lowp vec3 tintShadows(lowp vec3 texel, lowp vec3 tintColor, lowp float tintAmount) {
    return clamp(mix(texel, mix(texel, tintRaiseShadowsCurve(texel), tintColor), tintAmount), 0.0, 1.0);
}
lowp vec3 tintHighlights(lowp vec3 texel, lowp vec3 tintColor, lowp float tintAmount) {
    return clamp(mix(texel, mix(texel, vec3(1.0) - tintRaiseShadowsCurve(vec3(1.0) - texel), (vec3(1.0) - tintColor)), tintAmount), 0.0, 1.0);
}
highp vec4 rnm(in highp vec2 tc) {
    highp float noise = sin(dot(tc, vec2(12.9898, 78.233))) * 43758.5453;
    return vec4(fract(noise), fract(noise * 1.2154), fract(noise * 1.3453), fract(noise * 1.3647)) * 2.0 - 1.0;
}
highp float fade(in highp float t) {
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
    highp vec4 n_x = mix(vec4(n000, n001, n010, n011), vec4(n100, n101, n110, n111), fade(pf.x));
    highp vec2 n_xy = mix(n_x.xy, n_x.zw, fade(pf.y));
    return mix(n_xy.x, n_xy.y, fade(pf.z));
}
lowp vec2 coordRot(in lowp vec2 tc, in lowp float angle) {
    return vec2(((tc.x * 2.0 - 1.0) * cos(angle) - (tc.y * 2.0 - 1.0) * sin(angle)) * 0.5 + 0.5, ((tc.y * 2.0 - 1.0) * cos(angle) + (tc.x * 2.0 - 1.0) * sin(angle)) * 0.5 + 0.5);
}
void main() {
    lowp vec4 source = texture2D(sTexture, vTextureCoord);
    lowp vec4 result = source;
    const lowp float toolEpsilon = 0.005;
    if (skipTone < toolEpsilon) {
        result = vec4(applyRGBCurve(hslToRgb(applyLuminanceCurve(rgbToHsl(result.rgb)))), result.a);
    }
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
    if (abs(fadeAmount) > toolEpsilon) {
        result.rgb = fadeAdjust(result.rgb, fadeAmount);
    }
    lowp float satLuminance = dot(result.rgb, satLuminanceWeighting);
    lowp vec3 greyScaleColor = vec3(satLuminance);
    result = vec4(clamp(mix(greyScaleColor, result.rgb, saturation), 0.0, 1.0), result.a);
    if (abs(shadowsTintIntensity) > toolEpsilon) {
        result.rgb = tintShadows(result.rgb, shadowsTintColor, shadowsTintIntensity * 2.0);
    }
    if (abs(highlightsTintIntensity) > toolEpsilon) {
        result.rgb = tintHighlights(result.rgb, highlightsTintColor, highlightsTintIntensity * 2.0);
    }
    if (abs(exposure) > toolEpsilon) {
        mediump float mag = exposure * 1.045;
        mediump float exppower = 1.0 + abs(mag);
        if (mag < 0.0) {
            exppower = 1.0 / exppower;
        }
        result.r = 1.0 - pow((1.0 - result.r), exppower);
        result.g = 1.0 - pow((1.0 - result.g), exppower);
        result.b = 1.0 - pow((1.0 - result.b), exppower);
    }
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
