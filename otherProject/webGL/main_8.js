// 顶点着色器源码
var vertexShaderSrc = `
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main(){
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
}`;

// 片段着色器源码
var fragmentShaderSrc = `
precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main(){
    vec4 color = texture2D(u_Sampler, v_TexCoord);
    if(color.b > 0.5){
        color.a = 0.0;
    }
    gl_FragColor = color;
    
}`;

var g_LoadImage = false;
var g_LoadImage1 = false;


// 初始化使用的shader
function initShader(gl) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);// 创建顶点着色器
    gl.shaderSource(vertexShader, vertexShaderSrc);// 绑定顶点着色器源码
    gl.compileShader(vertexShader);// 编译定点着色器
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vertexShader));
        return;
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);// 创建片段着色器
    gl.shaderSource(fragmentShader, fragmentShaderSrc);// 绑定片段着色器源码
    gl.compileShader(fragmentShader);// 编译片段着色器
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var shaderProgram = gl.createProgram();// 创建着色器程序
    gl.attachShader(shaderProgram, vertexShader);// 指定顶点着色器
    gl.attachShader(shaderProgram, fragmentShader);// 指定片段着色色器
    gl.linkProgram(shaderProgram);// 链接程序
    gl.useProgram(shaderProgram);//使用着色器

    gl.program = shaderProgram;
}

function initVertexBuffers(gl){
    var verticesColors = new Float32Array([
        -1.0, 1.0, 0.0, 1.0,
        -1.0, -1.0, 0.0, 0.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, -1.0, 1.0, 0.0,
    ])

    var FSIZE = 4;

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
    gl.enableVertexAttribArray(a_TexCoord);


    return verticesColors.length / 4;
}

function initTexture(gl, n){
    var u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
    var u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");

    var image = new Image();
    var image1 = new Image();

    image.onload = function(){
        loadTexture(gl, n, u_Sampler, image, 0);
    }
    image.src = "./HelloWorld.png"
}

function main() {
    var canvas = document.getElementById("container");
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    initShader(gl);// 初始化着色器
    var n = initVertexBuffers(gl);
    initTexture(gl, n);
}

function loadTexture(gl, n, u_Sampler, image, texUnit){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    var texture = gl.createTexture();

    if(texUnit === 0){
        gl.activeTexture(gl.TEXTURE0);
        g_LoadImage = true;
    }else{
        gl.activeTexture(gl.TEXTURE1);
        g_LoadImage1 = true;
    }

    
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    var color = gl.RGBA;

    gl.texImage2D(gl.TEXTURE_2D, 0, color, color, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, texUnit)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

}










