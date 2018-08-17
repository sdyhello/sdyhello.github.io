gl_rads = [0, 0];
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

function initVertexBuffers(gl, shaderProgram) {
    var vertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0
    ]);

    var texCoords = new Float32Array([
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
    ]);

    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ]);

    var indexBuffer = gl.createBuffer();
    initArrayBuffer(gl, shaderProgram, vertices, 3, gl.FLOAT, 'a_Position');
    initArrayBuffer(gl, shaderProgram, texCoords, 2, gl.FLOAT, 'a_TexCoord');
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
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

    var vsFile = "res/textureToMat.vert.glsl";
    var fsFile = "res/textureToMat.frag.glsl";

    initShader(gl, vsFile, fsFile, function(shaderProgram){
        var n = initVertexBuffers(gl, shaderProgram);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        initTextures(gl, shaderProgram, n);
    });
}

function initTextures(gl, shaderProgram, num){
    var texture = gl.createTexture();
    var u_Sampler = gl.getUniformLocation(shaderProgram, "u_Sampler");
    var image = new Image();
    image.onload = function(){
        onLoadTexture(gl, shaderProgram, num, texture, u_Sampler, image);
        var tick = function(){
            onLoadTexture(gl, shaderProgram, num, texture, u_Sampler, image);
            requestAnimationFrame(tick);
        }
        tick();
        initEventHandle();
    }
    image.src = "HelloWorld.png"
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

function onLoadTexture(gl, shaderProgram, n, texture, u_Sampler, image){

    var u_MvpMatrix = gl.getUniformLocation(shaderProgram, "u_MvpMatrix");
    var viewMat = lookAt(3.0, 3.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    var projMat = getPerspectiveProjection(30, 16/9, 1, 100);
    var vpMat = multiMatrix44(projMat, viewMat);

    var modelMat = getRotationMatrix(gl_rads[1], 1, 0, 0);
    var mvpMat = multiMatrix44(vpMat, modelMat);
    modelMat = getRotationMatrix(gl_rads[0], 0, 1, 0);
    mvpMat = multiMatrix44(mvpMat, modelMat);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMat);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 0)
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initEventHandle(){
    var canvas = document.getElementById("container")
    var draging = false;
    var lastPos = [-1, -1];
    canvas.onmousedown = function(ev){
        var x = ev.clientX;
        var y = ev.clientY;
        var rect = ev.target.getBoundingClientRect();
        if(x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom){
            lastPos = [x, y];
            dragging = true;
        }
    }
    canvas.onmouseup = function (ev) {
        dragging = false;
    };

    canvas.onmousemove = function (ev) {
        var x = ev.clientX;
        var y = ev.clientY;
        if (dragging) {
            var factor = (2 * Math.PI) / 1280;
            var dx = factor * (x - lastPos[0]);
            var dy = factor * (lastPos[1] - y);
            gl_rads[0] = gl_rads[0] + dx % (2 * Math.PI);
            gl_rads[1] = gl_rads[1] + dy % (2 * Math.PI);
        }
        lastPos = [x, y];
    };
}











