precision highp float;

uniform sampler2D tDiffuse;

uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uBackground;

varying vec2 vUv;

float random (in vec2 _st) {
	return fract(sin(dot(_st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

// Simple hash function for noise
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// Calculate vignette effect
float vignette(vec2 uv, float strength) {
    vec2 position = uv - 0.5;
    return 1.0 - length(position) * strength;
}

void main() {
    vec2 uv = vUv;
    
    // Vignette
    float vignetteStrength = 1.1;
    float vignetteAmount = vignette(uv, vignetteStrength);

    // Grain
    float fHash = hash(uv + .01) * vignetteAmount;

	vec3 color = mix(uColor, uBackground, fHash);
	color = mix(color, uBackground, .75 * vignetteAmount);

	vec4 tDiffuseColor = texture2D(tDiffuse, uv);
	color = mix(color, tDiffuseColor.rgb, tDiffuseColor.a);
    
    gl_FragColor = vec4(color, 1.0);
}
