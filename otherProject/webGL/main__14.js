var g_LastTime = null;

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
        var u_MvpMatrix = gl.getUniformLocation(shaderProgram, "u_MvpMatrix");
        var u_ModelMatrix = gl.getUniformLocation(shaderProgram, "u_ModelMatrix");
        var u_NormalMatrix = gl.getUniformLocation(shaderProgram, "u_NormalMatrix");

        var projMat = getPerspectiveProjection(30, 16/9, 1, 100);
        var viewMat = lookAt(0, 2, 7, 0, 0, 0, 0, 1, 0);

        var u_LightColor = gl.getUniformLocation(shaderProgram, "u_LightColor");
        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

        var u_LightPosition = gl.getUniformLocation(shaderProgram, "u_LightPosition");
        gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);

        var u_LightColorAmbient = gl.getUniformLocation(shaderProgram, "u_LightColorAmbient");
        gl.uniform3f(u_LightColorAmbient, 0.2, 0.2, 0.2);

        var n = initVertexBuffers(gl, shaderProgram);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        var speed = Math.PI / 4;
        var rad = 0.0;
        var tick = function(timestamp){
            var delta = g_LastTime ?(timestamp - g_LastTime) / 1000: 0;
            g_LastTime = timestamp;
            rad = (rad + speed * delta) % (2 * Math.PI);
            draw(gl, n, rad, u_ModelMatrix, u_MvpMatrix, u_NormalMatrix, viewMat, projMat);
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });
}

function draw(gl, n, rad, u_ModelMatrix, u_MvpMatrix, u_NormalMatrix, viewMat, projMat){
    var modelMat = getRotationMatrix(rad, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMat);

    var inverseMat = inverseMatrix(modelMat);
    var inverseTranposeMat = transposeMatrix(inverseMat);
    gl.uniformMatrix4fv(u_NormalMatrix, false, inverseTranposeMat);

    var vpMat = multiMatrix44(projMat, viewMat);
    var mvpMat = multiMatrix44(vpMat, modelMat);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMat);

    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT, 0);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}


/**
 * 求矩阵的逆矩阵
 * */
function inverseMatrix(mat) {
    var inv = new Float32Array(16);
    inv[0] = mat[5] * mat[10] * mat[15] - mat[5] * mat[11] * mat[14] - mat[9] * mat[6] * mat[15]
        + mat[9] * mat[7] * mat[14] + mat[13] * mat[6] * mat[11] - mat[13] * mat[7] * mat[10];
    inv[4] = -mat[4] * mat[10] * mat[15] + mat[4] * mat[11] * mat[14] + mat[8] * mat[6] * mat[15]
        - mat[8] * mat[7] * mat[14] - mat[12] * mat[6] * mat[11] + mat[12] * mat[7] * mat[10];
    inv[8] = mat[4] * mat[9] * mat[15] - mat[4] * mat[11] * mat[13] - mat[8] * mat[5] * mat[15]
        + mat[8] * mat[7] * mat[13] + mat[12] * mat[5] * mat[11] - mat[12] * mat[7] * mat[9];
    inv[12] = -mat[4] * mat[9] * mat[14] + mat[4] * mat[10] * mat[13] + mat[8] * mat[5] * mat[14]
        - mat[8] * mat[6] * mat[13] - mat[12] * mat[5] * mat[10] + mat[12] * mat[6] * mat[9];

    inv[1] = -mat[1] * mat[10] * mat[15] + mat[1] * mat[11] * mat[14] + mat[9] * mat[2] * mat[15]
        - mat[9] * mat[3] * mat[14] - mat[13] * mat[2] * mat[11] + mat[13] * mat[3] * mat[10];
    inv[5] = mat[0] * mat[10] * mat[15] - mat[0] * mat[11] * mat[14] - mat[8] * mat[2] * mat[15]
        + mat[8] * mat[3] * mat[14] + mat[12] * mat[2] * mat[11] - mat[12] * mat[3] * mat[10];
    inv[9] = -mat[0] * mat[9] * mat[15] + mat[0] * mat[11] * mat[13] + mat[8] * mat[1] * mat[15]
        - mat[8] * mat[3] * mat[13] - mat[12] * mat[1] * mat[11] + mat[12] * mat[3] * mat[9];
    inv[13] = mat[0] * mat[9] * mat[14] - mat[0] * mat[10] * mat[13] - mat[8] * mat[1] * mat[14]
        + mat[8] * mat[2] * mat[13] + mat[12] * mat[1] * mat[10] - mat[12] * mat[2] * mat[9];

    inv[2] = mat[1] * mat[6] * mat[15] - mat[1] * mat[7] * mat[14] - mat[5] * mat[2] * mat[15]
        + mat[5] * mat[3] * mat[14] + mat[13] * mat[2] * mat[7] - mat[13] * mat[3] * mat[6];
    inv[6] = -mat[0] * mat[6] * mat[15] + mat[0] * mat[7] * mat[14] + mat[4] * mat[2] * mat[15]
        - mat[4] * mat[3] * mat[14] - mat[12] * mat[2] * mat[7] + mat[12] * mat[3] * mat[6];
    inv[10] = mat[0] * mat[5] * mat[15] - mat[0] * mat[7] * mat[13] - mat[4] * mat[1] * mat[15]
        + mat[4] * mat[3] * mat[13] + mat[12] * mat[1] * mat[7] - mat[12] * mat[3] * mat[5];
    inv[14] = -mat[0] * mat[5] * mat[14] + mat[0] * mat[6] * mat[13] + mat[4] * mat[1] * mat[14]
        - mat[4] * mat[2] * mat[13] - mat[12] * mat[1] * mat[6] + mat[12] * mat[2] * mat[5];

    inv[3] = -mat[1] * mat[6] * mat[11] + mat[1] * mat[7] * mat[10] + mat[5] * mat[2] * mat[11]
        - mat[5] * mat[3] * mat[10] - mat[9] * mat[2] * mat[7] + mat[9] * mat[3] * mat[6];
    inv[7] = mat[0] * mat[6] * mat[11] - mat[0] * mat[7] * mat[10] - mat[4] * mat[2] * mat[11]
        + mat[4] * mat[3] * mat[10] + mat[8] * mat[2] * mat[7] - mat[8] * mat[3] * mat[6];
    inv[11] = -mat[0] * mat[5] * mat[11] + mat[0] * mat[7] * mat[9] + mat[4] * mat[1] * mat[11]
        - mat[4] * mat[3] * mat[9] - mat[8] * mat[1] * mat[7] + mat[8] * mat[3] * mat[5];
    inv[15] = mat[0] * mat[5] * mat[10] - mat[0] * mat[6] * mat[9] - mat[4] * mat[1] * mat[10]
        + mat[4] * mat[2] * mat[9] + mat[8] * mat[1] * mat[6] - mat[8] * mat[2] * mat[5];

    var det = mat[0] * inv[0] + mat[1] * inv[4] + mat[2] * inv[8] + mat[3] * inv[12];
    det = 1 / det;

    var d = new Float32Array(16);
    for (var i = 0; i < 16; i++) {
        d[i] = inv[i] * det;
    }
    return d;
}
