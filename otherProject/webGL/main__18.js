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

    var colors = new Float32Array([
        0.2, 0.58, 0.82, 0.2, 0.58, 0.82, 0.2, 0.58, 0.82, 0.2, 0.58, 0.82,
        0.5, 0.41, 0.69, 0.5, 0.41, 0.69, 0.5, 0.41, 0.69, 0.5, 0.41, 0.69,
        0.0, 0.32, 0.61, 0.0, 0.32, 0.61, 0.0, 0.32, 0.61, 0.0, 0.32, 0.61,
        0.78, 0.69, 0.84, 0.78, 0.69, 0.84, 0.78, 0.69, 0.84, 0.78, 0.69, 0.84,
        0.32, 0.18, 0.56, 0.32, 0.18, 0.56, 0.32, 0.18, 0.56, 0.32, 0.18, 0.56,
        0.73, 0.82, 0.93, 0.73, 0.82, 0.93, 0.73, 0.82, 0.93, 0.73, 0.82, 0.93,
    ]);

    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ]);

    initArrayBuffer(gl, shaderProgram, vertices, 3, gl.FLOAT, 'a_Position');
    initArrayBuffer(gl, shaderProgram, colors, 3, gl.FLOAT, 'a_Color');
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var indexBuffer = gl.createBuffer();
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

    var vsFile = "res/vert_18.glsl";
    var fsFile = "res/frag_18.glsl";

    initShader(gl, vsFile, fsFile, function(shaderProgram){
        var n = initVertexBuffers(gl, shaderProgram);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        
        var u_Clicked = gl.getUniformLocation(shaderProgram, "u_Clicked");
        gl.uniform1i(u_Clicked, 0);

        var viewMat = lookAt(3.0, 3.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
        var projMat = getPerspectiveProjection(30, 16/9, 1, 100);
        var vpMat = multiMatrix44(projMat, viewMat);

        var u_MvpMatrix = gl.getUniformLocation(shaderProgram, "u_MvpMatrix");
        gl.uniformMatrix4fv(u_MvpMatrix, false, vpMat);

        var tick = function(){
            draw(gl, n);
            requestAnimationFrame(tick);
        };
        tick();

        var canvas = document.getElementById("container");
        canvas.onmousedown = function(ev) {
            var x = ev.clientX, y = ev.clientY;
            var rect = ev.target.getBoundingClientRect();
            if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
                var x_in_canvas = x - rect.left;
                var y_in_canvas = rect.bottom - y;
                var click = check(gl, shaderProgram, n, x_in_canvas, y_in_canvas);
                if (click){
                    console.log('The cube was selected!');
                }
            }
        }
    });
}

function check(gl, shaderProgram, n, x, y){
    var click = false;
    var u_Clicked = gl.getUniformLocation(shaderProgram, "u_Clicked");
    gl.uniform1i(u_Clicked, 1);
    draw(gl, n);

    var pixels = new Uint8Array(4);
    gl.readPixels(x,  y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    if(pixels[0] === 255){
        click = true;
    }

    gl.uniform1i(u_Clicked, 0);
    draw(gl, n);
    return click;
}

function draw(gl, n){
    gl.clear(gl.COLOR_BUFFER_BIT |gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n,  gl.UNSIGNED_BYTE, 0)
}










