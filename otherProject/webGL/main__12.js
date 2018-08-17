// 顶点着色器源码
var gl_SrcVS = `
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_MvpMatrix;
varying vec4 v_Color;
void main(){
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
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

function initVertexBuffers(gl, shaderProgram) {
    var verticesColors = new Float32Array([
        1.0,  1.0,  1.0,     1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,
        1.0, -1.0,  1.0,     1.0,  1.0,  0.0,
        1.0, -1.0, -1.0,     0.0,  1.0,  0.0,
        1.0,  1.0, -1.0,     0.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,
        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0
    ]);

    // 立方体的六个面，每个面有两个三角形组成
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,
        0, 3, 4,   0, 4, 5,
        0, 5, 6,   0, 6, 1,
        1, 6, 7,   1, 7, 2,
        7, 4, 3,   7, 3, 2,
        4, 7, 6,   4, 6, 5
    ]);
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;

    var vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(shaderProgram, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function getGL(){
    var canvas = document.getElementById("container");
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return gl;
}

function main() {
    var gl = getGL();
    var shaderProgram = initShader(gl, gl_SrcVS, gl_SrcFS);

    var projMat = getPerspectiveProjection(30, 1, 1, 100);
    var viewMat = lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    var mvpMat = multiMatrix44(projMat, viewMat);

    var u_MvpMatrix = gl.getUniformLocation(shaderProgram, "u_MvpMatrix");
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMat);

    var n = initVertexBuffers(gl, shaderProgram);
    draw(gl, n);

}

function draw(gl, n){

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT, 0);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}



