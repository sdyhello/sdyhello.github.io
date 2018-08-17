// 顶点着色器源码
var vertexShaderSrc = `
attribute vec4 a_Position;
attribute float a_PointSize;
void main(){
    gl_Position = a_Position;// gl_Position 内置变量，表示点的位置，必须赋值
    gl_PointSize = a_PointSize;// gl_PointSize 内置变量，表示点的大小（单位像素），可以不赋值，默认为1.0，，绘制单个点时才生效
}`;

// 片段着色器源码
var fragmentShaderSrc = `
precision mediump float;
uniform vec4 u_FragColor;
void main(){
    gl_FragColor = u_FragColor;// 内存变量，表示片元颜色RGBA
}`;

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

    gl.program = shaderProgram;
}

function setShaderParam(gl){
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttrib4f(a_Position, -0.5, 0.0, 0.0, 1.0);

    var a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
    gl.vertexAttrib1f(a_PointSize, 10.0);

    return a_Position;
}

function main() {
    var canvas = document.getElementById("container");
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    initShader(gl);// 初始化着色器
    var a_Position = setShaderParam(gl);
    var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");

    canvas.onmousedown = function(event){
        onClick(event, gl, canvas, a_Position, u_FragColor);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);// 指定清空canvas的颜色
    gl.clear(gl.COLOR_BUFFER_BIT);// 清空canvas
}

g_points = [];
g_colors = [];
function onClick(event, gl, canvas, a_Position, u_FragColor){
    var rect = event.target.getBoundingClientRect();
    var x = ((event.clientX - rect.left) - canvas.width * 0.5) / (canvas.width * 0.5);
    var y = (canvas.height *0.5 - (event.clientY - rect.top)) / (canvas.height * 0.5);
    g_points.push([x, y]);

    if(x >= 0 && y >= 0){
        g_colors.push([1.0, 0.0, 0.0, 1.0]);
    }else if(x < 0 && y > 0){
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
    }else if(x < 0 && y < 0){
        g_colors.push([0.0, 0.5, 1.0, 1.0]);
    }else{
        g_colors.push([1.0, 1.0, 0.0, 1.0]);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    for(var i = 0; i < g_points.length; i++){
        var pos = g_points[i];
        var rgba = g_colors[i];

        gl.vertexAttrib4f(a_Position, pos[0], pos[1], 0.0, 1.0);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

















