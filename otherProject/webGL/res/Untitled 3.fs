uniform sampler2D inputImageTexture;
uniform sampler2D inputImageTexture2;

uniform int type;
uniform vec2 center;
uniform float farthestClearAreaDistance;
uniform float nearestFullBlurAreaDistance;
uniform float tiltShiftRotationAngle;
uniform float imageWidthAndHeightRatio;

void main()
{
    vec4 sharpImageColor = texture2D(inputImageTexture, gl_TexCoord[0].xy);
    vec4 blurredImageColor = texture2D(inputImageTexture2, gl_TexCoord[0].xy);
   
    vec2 normalizedCoordinate =  gl_TexCoord[0].xy * vec2(imageWidthAndHeightRatio, 1.0);
    vec2 normalizedCenter = center * vec2(imageWidthAndHeightRatio, 1.0);
   
    float d;
    if (type == 0) {
        d = 0.0;
    } else if (type == 1) {
        d = distance(normalizedCenter,normalizedCoordinate);
    } else if (type == 2) {
        float tanAngle = tan(tiltShiftRotationAngle);
        d = abs(tanAngle * normalizedCoordinate.x - normalizedCoordinate.y + normalizedCenter.y - normalizedCenter.x * tanAngle ) / sqrt(tanAngle * tanAngle + 1.0);
    }
    vec4 mask;
    if (d < farthestClearAreaDistance) {
        mask = vec4(.0,.0,.0,1.0);
    } else {
        float b = smoothstep(farthestClearAreaDistance, nearestFullBlurAreaDistance, d);
        mask = vec4(b,b,b,1.0);
    }
    gl_FragColor = mix(sharpImageColor, blurredImageColor, mask);
}