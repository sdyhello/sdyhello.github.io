// 顶点着色器源码
var vertexShaderSrc = `
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_ProjMat;
uniform mat4 u_ViewMat;
varying vec4 v_Color;
void main(){
    gl_Position = u_ProjMat * u_ViewMat * a_Position;
    v_Color = a_Color;
}`;

// 片段着色器源码
var fragmentShaderSrc = `
precision mediump float;
varying vec4 v_Color;
void main(){
    gl_FragColor = v_Color;
}`;

var g_near = 0.0;
var g_far = 0.5;
var g_nf;

// 初始化使用的shader
function initShader(gl) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);// 创建顶点着色器
    gl.shaderSource(vertexShader, vertexShaderSrc);// 绑定顶点着色器源码
    gl.compileShader(vertexShader);// 编译定点着色器

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);// 创建片段着色器
    gl.shaderSource(fragmentShader, fragmentShaderSrc);// 绑定片段着色器源码
    gl.compileShader(fragmentShader);// 编译片段着色器

    var shaderProgram = gl.createProgram();// 创建着色器程序
    gl.attachShader(shaderProgram, vertexShader);// 指定顶点着色器
    gl.attachShader(shaderProgram, fragmentShader);// 指定片段着色色器
    gl.linkProgram(shaderProgram);// 链接程序
    gl.useProgram(shaderProgram);//使用着色器

    return shaderProgram;
}

function initVertexBuffers(gl, shaderProgram){
    var verticesColors = new Float32Array([
        0.0, 0.5, -0.4,     0.4, 1.0, 0.4,
        -0.5, -0.5, -0.4,   0.4, 1.0, 0.4,
        0.5, -0.5, -0.4,    1.0, 0.4, 0.4,

        0.5, 0.4, -0.2,     1.0, 0.4, 0.4,
        -0.5, 0.4, -0.2,    1.0, 1.0, 0.4,
        0.0, -0.6, -0.2,    1.0, 0.4, 0.4,

        0.0, 0.5, 0.0,      0.4, 0.4, 1.0,
        -0.5, -0.5, 0.0,    0.4, 0.4, 1.0,
        0.5, -0.5, 0.0,     1.0, 0.4, 0.4,
    ])

    var FSIZE = 4;

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(shaderProgram, "a_Position");
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(shaderProgram, "a_Color");
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
    gl.enableVertexAttribArray(a_Color);


    return verticesColors.length / 6;
}

function getGL(){
    var canvas = document.getElementById("container");
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return gl;
}

function main() {
    console.log("begin");
    g_nf = document.getElementById("nearFar");
    var gl = getGL();
    var shaderProgram = initShader(gl);
    var n = initVertexBuffers(gl, shaderProgram);
    draw(gl, shaderProgram, n);

    document.onkeydown = function(event){
        if(event.key === 'a'){
            g_near += 0.1;
            draw(gl, shaderProgram, n);
        }else if (event.key === "d"){
            g_near -= 0.1;
            draw(gl, shaderProgram, n)
        }else if (event.key === "w"){
            g_far += 0.1;
            draw(gl, shaderProgram, n)
        }else if (event.key === "s"){
            g_far -= 0.1;
            draw(gl, shaderProgram, n)
        }
    }
}

function draw(gl, shaderProgram, n){
    g_nf.innerHTML = "near:" + g_near + ", far:" + g_far;
    var u_ProjMat = gl.getUniformLocation(shaderProgram, "u_ProjMat");
    var projMat = getOrthoProjection(-1, 1, -1, 1, g_near, g_far);
    gl.uniformMatrix4fv(u_ProjMat, false, projMat);

    var u_ViewMat = gl.getUniformLocation(shaderProgram, "u_ViewMat");
    var viewMat = lookAt(0, 0, 0, 0, 0, -1, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMat, false, viewMat);

    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function getOrthoProjection(left, right, bottom, top, near, far){
    var rw = 1/ (right - left);
    var rh = 1 / (top - bottom);
    var rd = 1 / (far - near);
    return new Float32Array([
        2 * rw, 0, 0, 0,
        0, 2 * rw, 0, 0,
        0, 0, -2 * rw, 0,
        -(right + left) * rw, -(top + bottom) * rh , -(far + near) * rd, 1
    ]);
}

function getTranslationMatrix(x, y, z){
    return new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        x, y, z, 1.0,
    ]);
}

function getRotationMatrix(rad, x, y, z){
    if (x > 0){
        return new Float32Array([
            1.0, 0.0, 0.0, 0.0,
            0.0, Math.cos(rad), -Math.sin(rad), 0.0,
            0.0, Math.sin(rad), Math.cos(rad), 0.0,
            0.0, 0.0, 0.0, 1.0,
        ]);
    }else if (y > 0){
        return new Float32Array([
            Math.cos(rad), 0.0, -Math.sin(rad), 0.0,
            Math.sin(rad), 0.0, Math.cos(rad), 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0,
        ]);
    }else if (z > 0){
        return new Float32Array([
            Math.cos(rad), Math.sin(rad), 0.0, 0.0,
            -Math.sin(rad), Math.cos(rad), 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0,
        ]);
    }else{
        return new Float32Array([
            1.0, 0.0, 0.0, 0.0, 
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0,
        ]);
    }
}

function lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ){
    var zAxis = subVector([centerX, centerY, centerZ], [eyeX, eyeY, eyeZ]);
    var N = normalizeVector(zAxis);

    var xAxis = crossMultiVector(N, [upX, upY, upZ]);
    var U = normalizeVector(xAxis);

    var V = crossMultiVector(U, N);

    var r = new Float32Array([
        U[0], V[0], -N[0], 0,
        U[1], V[1], -N[1], 0,
        U[2], V[2], -N[2], 0,
        0, 0, 0, 1
    ]);
    var t = getTranslationMatrix(-eyeX, -eyeY, -eyeZ);
    return multiMatrix44(r, t);

}

function subVector(v1, v2){
    return [v1[0] - v2[0], v1[1] - v2[2], v1[2] - v2[2]];
}

function normalizeVector(v){
    var len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return (len > 0.00001)? [v[0] / len, v[1] / len, v[2] / len] : [0, 0, 0];
}

function crossMultiVector(v1, v2) {
    return [
        v1[1] * v2[2] - v1[2] * v2[1],
        v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0]
    ];
}

function multiMatrix44(mat1, mat2) {
    // var mat1 = transposeMatrix(m1);
    // var mat2 = transposeMatrix(m2);

    var res = new Float32Array(16);
    for (var i = 0; i < 4; i++) {
        var row = [mat1[i * 4], mat1[i * 4 + 1], mat1[i * 4 + 2], mat1[i * 4 + 3]];
        for (var j = 0; j < 4; j++) {
            var col = [mat2[j], mat2[j + 4], mat2[j + 8], mat2[j + 12]];
            res[i * 4 + j] = dotMultiVector(row, col);
        }
    }
    return res;
}

function dotMultiVector(v1, v2) {
    var res = 0;
    for (var i = 0; i < v1.length; i++) {
        res += v1[i] * v2[i];
    }
    return res;
}

function transposeMatrix(mat){
    var res = new Float32Array(16);
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            res[i * 4 + j] = mat[j * 4 + i];
        }
    }
    return res;
}



