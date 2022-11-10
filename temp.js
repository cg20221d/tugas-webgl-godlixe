function main() {
    /** @type {HTMLCanvasElement} */
    var kanvas = document.getElementById("kanvas");
    var gl = kanvas.getContext("webgl");

    var vertices = [
        // Face A       // Red
        -1, -1, -1,     1, 0, 0,    // Index:  0    
         1, -1, -1,     1, 0, 0,    // Index:  1
         1,  1, -1,     1, 0, 0,    // Index:  2
        -1,  1, -1,     1, 0, 0,    // Index:  3
        // Face B       // Yellow
        -1, -1,  1,     1, 1, 0,    // Index:  4
         1, -1,  1,     1, 1, 0,    // Index:  5
         1,  1,  1,     1, 1, 0,    // Index:  6
        -1,  1,  1,     1, 1, 0,    // Index:  7
        // Face C       // Green
        -1, -1, -1,     0, 1, 0,    // Index:  8
        -1,  1, -1,     0, 1, 0,    // Index:  9
        -1,  1,  1,     0, 1, 0,    // Index: 10
        -1, -1,  1,     0, 1, 0,    // Index: 11
        // Face D       // Blue
         1, -1, -1,     0, 0, 1,    // Index: 12
         1,  1, -1,     0, 0, 1,    // Index: 13
         1,  1,  1,     0, 0, 1,    // Index: 14
         1, -1,  1,     0, 0, 1,    // Index: 15
        // Face E       // Orange
        -1, -1, -1,     1, 0.5, 0,  // Index: 16
        -1, -1,  1,     1, 0.5, 0,  // Index: 17
         1, -1,  1,     1, 0.5, 0,  // Index: 18
         1, -1, -1,     1, 0.5, 0,  // Index: 19
        // Face F       // White
        // -1,  1, -1,     1, 1, 1,    // Index: 20
        // -1,  1,  1,     1, 1, 1,    // Index: 21
        //  1,  1,  1,     1, 1, 1,    // Index: 22
        //  1,  1, -1,     1, 1, 1     // Index: 23
    ];

    var indices = [
        0, 1,     1, 2, 2,3, 3, 0, 3, 1,     // Face A
        4, 5, 5, 6, 6, 7, 7, 4,         // Face B
        8, 9,   9, 10,  10, 11, 11, 8, // Face C
        ,12, 13, 14,  12, 14, 15,  // Face D
        16, 17, 18,  16, 18, 19,  // Face E
        // 20, 21, 22,  20, 22, 23   // Face F     
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Vertex shader
    var vertexShaderCode =  `
    attribute vec3 aPosition;   // Sebelumnya vec2, makanya tidak tergambar kubus :D
    attribute vec3 aColor;
    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    varying vec3 vColor;
    void main() {
        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
        vColor = aColor;
    }
    `;
    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject);   // sampai sini sudah jadi .o

    // Fragment shader
    var fragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;
    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
    `;
    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    gl.compileShader(fragmentShaderObject);   // sampai sini sudah jadi .o

    var shaderProgram = gl.createProgram(); // wadah dari executable (.exe)
    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram, fragmentShaderObject);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    // Variabel lokal
    var theta = 0.0;
    var freeze = false;
    var horizontalSpeed = 0.0;
    var verticalSpeed = 0.0;
    var horizontalDelta = 0.0;
    var verticalDelta = 0.0;

    // Variabel pointer ke GLSL
    var uModel = gl.getUniformLocation(shaderProgram, "uModel");
    // View
    var cameraX = 0.0;
    var cameraZ = 5.0;
    var uView = gl.getUniformLocation(shaderProgram, "uView");
    var view = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(
        view,
        [cameraX, 0.0, cameraZ],    // the location of the eye or the camera
        [cameraX, 0.0, -10],        // the point where the camera look at
        [0.0, 1.0, 0.0]
    );
    // Projection
    var uProjection = gl.getUniformLocation(shaderProgram, "uProjection");
    var perspective = glMatrix.mat4.create();
    glMatrix.mat4.perspective(perspective, Math.PI/3, 1.0, 0.5, 10.0);

    // Kita mengajari GPU bagaimana caranya mengoleksi
    //  nilai posisi dari ARRAY_BUFFER
    //  untuk setiap verteks yang sedang diproses
    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 
        6 * Float32Array.BYTES_PER_ELEMENT, 
        0);
    gl.enableVertexAttribArray(aPosition);
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 
        6 * Float32Array.BYTES_PER_ELEMENT, 
        3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    // Grafika interaktif
    // Tetikus
    function onMouseClick(event) {
        freeze = !freeze;
    }
    document.addEventListener("click", onMouseClick);
    // Papan ketuk
    function onKeydown(event) {
        if (event.keyCode == 32) freeze = !freeze;  // spasi
        // Gerakan horizontal: a ke kiri, d ke kanan
        if (event.keyCode == 65) {  // a
            horizontalSpeed = -0.01;
        } else if (event.keyCode == 68) {   // d
            horizontalSpeed = 0.01;
        }
        // Gerakan vertikal: w ke atas, s ke bawah
        if (event.keyCode == 87) {  // w
            verticalSpeed = -0.01;
        } else if (event.keyCode == 83) {   // s
            verticalSpeed = 0.01;
        }
    }
    function onKeyup(event) {
        if (event.keyCode == 32) freeze = !freeze;
        if (event.keyCode == 65 || event.keyCode == 68) horizontalSpeed = 0.0;
        if (event.keyCode == 87 || event.keyCode == 83) verticalSpeed = 0.0;
    }
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);

    function render() {
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(1.0,      0.65,    0.0,    1.0);  // Oranye
        //            Merah     Hijau   Biru    Transparansi
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (!freeze) {
            theta += 0.01;
        }
        horizontalDelta += horizontalSpeed;
        verticalDelta -= verticalSpeed;
        var model = glMatrix.mat4.create(); // Membuat matriks identitas
        glMatrix.mat4.translate(
            model, model, [horizontalDelta, verticalDelta, 0.0]
        );
        glMatrix.mat4.rotateX(
            model, model, theta
        );
        glMatrix.mat4.rotateY(
            model, model, theta
        );
        glMatrix.mat4.rotateZ(
            model, model, theta
        );
        gl.uniformMatrix4fv(uModel, false, model);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        gl.drawElements(gl.LINES, 18, gl.UNSIGNED_SHORT, 0);


        // 2nd
        
        var model2 = glMatrix.mat4.create(); // Membuat matriks identitas
        glMatrix.mat4.translate(
            model2, model2, [2, verticalDelta, 0.0]
        );
        glMatrix.mat4.rotateX(
            model2, model2, theta
        );
        glMatrix.mat4.rotateY(
            model2, model2, theta
        );
        glMatrix.mat4.rotateZ(
            model2, model2, theta
        );
        gl.uniformMatrix4fv(uModel, false, model2);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        gl.drawElements(gl.LINES, 8, gl.UNSIGNED_SHORT, 36);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 54);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_CHAR, 5);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    console.log(gl.getError())
}