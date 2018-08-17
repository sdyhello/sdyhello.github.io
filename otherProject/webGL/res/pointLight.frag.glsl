precision lowp float;

uniform vec3 u_LightColor; //入射光颜色
uniform vec3 u_LightPosition; //点光源位置
uniform vec3 u_LightColorAmbient; //环境光颜色

varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;
void main(){
    vec3 dir = normalize(u_LightPosition - v_Position); //计算入射光线反方向并归一化
    float cos = max(dot(dir, v_Normal), 0.0);
    vec3 diffuse = u_LightColor * vec3(v_Color) * cos;
    vec3 ambient = u_LightColorAmbient * v_Color.rgb;
    gl_FragColor = vec4(diffuse + ambient, v_Color.a);
}