var g_RadParent = 0.0;
var g_RadChild = 0.0;

// 初始化使用的shader
function initShader(gl, vsFile, fsFile, cb) {
    var vs = null;
    var fs = null;

    var onShaderLoaded = function(){
        if (vs && fs){
            var sp = createProgram(gl, vs, fs);
            gl.useProgram(sp);
            cb(sp);
        }
    }
    loadShaderFromFile(vsFile, function(vsContent){
        vs = vsContent;
        onShaderLoaded();
    });

    loadShaderFromFile(fsFile, function(vsContent){
        fs = vsContent;
        onShaderLoaded();
    });
}

function loadShader(gl, type, src){
    var shader = gl.createShader(type);// 创建顶点着色器
    gl.shaderSource(shader, src);// 绑定顶点着色器源码
    gl.compileShader(shader);// 编译定点着色器
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
        return;
    }
    return shader;
}

function createProgram(gl, srcVS, srcFS){
    vs = loadShader(gl, gl.VERTEX_SHADER, srcVS);
    fs = loadShader(gl, gl.FRAGMENT_SHADER, srcFS);

    var shaderProgram = gl.createProgram();// 创建着色器程序
    gl.attachShader(shaderProgram, vs);// 指定顶点着色器
    gl.attachShader(shaderProgram, fs);// 指定片段着色色器
    gl.linkProgram(shaderProgram);// 链接程序
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(shaderProgram));
        return;
    }
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

function loadShaderFromFile(filename, onLoadShader){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === 4 && request.status === 200){
            onLoadShader(request.responseText);
        }
    };
    request.open("GET", filename, true);
    request.send();
}
function main() {
    var gl = getGL();

    var vsFile = "res/pointLight.vert.glsl";
    var fsFile = "res/pointLight.frag.glsl";

    initShader(gl, vsFile, fsFile, function(shaderProgram){
        var n = initVertexBuffers(gl, shaderProgram);
        render(gl, shaderProgram, n);
        var speed = Math.PI * 0.02;
        document.onkeydown = function (ev){
            switch(ev.keyCode){
                case 37: //left
                    g_RadParent = (g_RadParent + speed) % (Math.PI * 2);
                    break;
                case 39:// right
                    g_RadParent = (g_RadParent - speed) % (Math.PI * 2);
                    break;
                case 38:// up
                    g_RadChild = (g_RadChild + speed) % (Math.PI * 2);
                    break;
                case 40:// down
                    g_RadChild = (g_RadChild - speed) % (Math.PI * 2);
                    break;
                default:
                    break;
            }
            render(gl, shaderProgram, n);
        }
        
    });
}

function render(gl, shaderProgram, n){
    var u_LightColor = gl.getUniformLocation(shaderProgram, "u_LightColor");
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

    var u_LightPosition = gl.getUniformLocation(shaderProgram, "u_LightPosition");
    gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);

    var u_LightColorAmbient = gl.getUniformLocation(shaderProgram, "u_LightColorAmbient");
    gl.uniform3f(u_LightColorAmbient, 0.2, 0.2, 0.2);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //parent node
    var u_ModelMatrix = gl.getUniformLocation(shaderProgram, "u_ModelMatrix");
    var transMatParent = getTranslationMatrix(0.0, -10, 0.0);
    var rotMatParent = getRotationMatrix(g_RadParent, 0, 1, 0);
    var modelMatParent = multiMatrix44(rotMatParent, transMatParent);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatParent);
    draw(gl, shaderProgram, n, modelMatParent);

    //child
    var transMatChild = getTranslationMatrix(0.0, 10, 0.0);
    var rotMatChild = getRotationMatrix(g_RadChild, 0, 1, 0);
    var scaleMatChild = getScaleMatrix(0.8, 1.0, 0.8);
    var modelMatChild = multiMatrix44(transMatChild, modelMatParent);

    modelMatChild = multiMatrix44(rotMatChild, modelMatChild);
    modelMatChild = multiMatrix44(scaleMatChild, modelMatChild);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatChild);
    draw(gl, shaderProgram, n, modelMatChild);

}

function draw(gl, shaderProgram, n, modelMat){
    var inverseMat = inverseMatrix(modelMat)
    var inverseTranposeMat = transposeMatrix(inverseMat);
    var u_NormalMatrix = gl.getUniformLocation(shaderProgram, "u_NormalMatrix");
    gl.uniformMatrix4fv(u_NormalMatrix, false, inverseTranposeMat);

    var viewMat = lookAt(0.0, -5.0, 10.0, 0.0, -5.0, 0.0, 0.0, 1.0, 0.0);
    var projMat = getPerspectiveProjection(90, 16/9, 1, 100);
    var vpMat = multiMatrix44(projMat, viewMat);
    var mvpMat = multiMatrix44(vpMat, modelMat);

    var u_MvpMatrix = gl.getUniformLocation(shaderProgram, "u_MvpMatrix");
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMat);

    gl.drawElements(gl.TRIANGLES, n,  gl.UNSIGNED_BYTE, 0)

}













