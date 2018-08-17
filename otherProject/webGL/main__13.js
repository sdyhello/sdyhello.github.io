// 顶点着色器源码
var gl_SrcVS = `
attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal; //顶点法向量

uniform mat4 u_MvpMatrix;
uniform vec3 u_LightColor; //入射光颜色
uniform vec3 u_LightDir; //入射方向
uniform vec3 u_LightColorAmbient; //环境光颜色
varying vec4 v_Color;

void main(){
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize(vec3(a_Normal)); //归一化向量
    float cos = max(dot(u_LightDir, normal), 0.0);
    vec3 diffuse = u_LightColor * vec3(a_Color) * cos;
    vec3 ambient = u_LightColorAmbient * a_Color.rgb;
    v_Color = vec4(diffuse + ambient, a_Color.a);
}`;

// 片段着色器源码
var gl_SrcFS = `
precision mediump float;
varying vec4 v_Color;
void main(){
    gl_FragColor = v_Color;
}`;

var g_near = 0.0;
var g_far = 0.5;
var g_nf;

// 初始化使用的shader
function initShader(gl, srcVS, srcFS) {
    shaderProgram = createProgram(gl, srcVS, srcFS);
    gl.useProgram(shaderProgram);//使用着色器

    return shaderProgram;
}

function loadShader(gl, type, src){
    var shader = gl.createShader(type);// 创建顶点着色器
    gl.shaderSource(shader, src);// 绑定顶点着色器源码
    gl.compileShader(shader);// 编译定点着色器
    return shader;
}

function createProgram(gl, srcVS, srcFS){
    vs = loadShader(gl, gl.VERTEX_SHADER, srcVS);
    fs = loadShader(gl, gl.FRAGMENT_SHADER, srcFS);

    var shaderProgram = gl.createProgram();// 创建着色器程序
    gl.attachShader(shaderProgram, vs);// 指定顶点着色器
    gl.attachShader(shaderProgram, fs);// 指定片段着色色器
    gl.linkProgram(shaderProgram);// 链接程序
    return shaderProgram;
}

function initVertexBuffers(gl, sp) {
    // 立方体的六个面及每个面的两个三角形
    var vertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0
    ]);

    // 每个顶点的法向量
    var normals = new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0
    ]);

    // 每个顶点的颜色
    var colors = new Float32Array([
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0
    ]);

    // 立方体的六个面，每个面有两个三角形组成
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ]);

    initArrayBuffer(gl, sp, vertices, 3, gl.FLOAT, "a_Position");
    initArrayBuffer(gl, sp, normals, 3, gl.FLOAT, "a_Normal");
    initArrayBuffer(gl, sp, colors, 3, gl.FLOAT, "a_Color");

    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, sp, tables, offset, value, type){
    var buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, tables, gl.STATIC_DRAW);

    var attr = gl.getAttribLocation(sp, type);
    gl.vertexAttribPointer(attr, offset, value, false, 0, 0);
    gl.enableVertexAttribArray(attr);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function getGL(){
    var canvas = document.getElementById("container");
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return gl;
}

function main() {
    var gl = getGL();
    var shaderProgram = initShader(gl, gl_SrcVS, gl_SrcFS);

    var projMat = getPerspectiveProjection(30, 16/9, 1, 100);
    var viewMat = lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    var mvpMat = multiMatrix44(projMat, viewMat);

    var u_MvpMatrix = gl.getUniformLocation(shaderProgram, "u_MvpMatrix");
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMat);


    var u_LightColor = gl.getUniformLocation(shaderProgram, "u_LightColor");
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

    var dir = normalizeVector([0.5, 3.0, 4.0]);
    var u_LightDir = gl.getUniformLocation(shaderProgram, "u_LightDir");
    gl.uniform3f(u_LightDir, dir[0], dir[1], dir[2]);

    var u_LightColorAmbient = gl.getUniformLocation(shaderProgram, "u_LightColorAmbient");
    gl.uniform3f(u_LightColorAmbient, 0.2, 0.2, 0.2);

    var n = initVertexBuffers(gl, shaderProgram);
    draw(gl, n);

}

function draw(gl, n){

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT, 0);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}



