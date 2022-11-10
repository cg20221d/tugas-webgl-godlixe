function generateSideFacesIndex(indicesArr, start, end, offset){
    for(let i=start;i<end;i++){
        indicesArr.push(i, i+offset)
        indicesArr.push(i, i+1)
        indicesArr.push(i+1, i+offset+1)
        indicesArr.push(i+offset+1, i+1)
    }
}

// Modifies the z position of a set of vertices with color
function modifyZPosition(src_vertices, dst_vertices, start, numPoints, newZ){
    for(let i = start;i<start+6*(numPoints);i++){
        if((i+1)%3==0) dst_vertices.push(newZ)
        else dst_vertices.push(src_vertices[i])
    }
}

// Generates indices for line primitives
function generateLineIndices(indicesArr, start_idx, last_idx){
    indicesArr.push(start_idx)
    for(let i=start_idx+1;i<last_idx;i++){
        indicesArr.push(i, i)
    }
    indicesArr.push(start_idx)
}

// Duplicates set of points from start to start+numpoints*2
// and add z position for the original set of points and the duplicate
// function duplicateAndAddZ(vertices, z, start, numPoints){
//     for(let i=start;i<start+(numPoints*2);i++){
//         if((i+1)%2==0) vertices.push(z)
//     }
// }

// Offset a set of vertices
// from start to start+numpoints*2
function offset(vertices, x, y, start, numPoints){
    for(let i=start;i<start+(numPoints*2);i++){
        if(i%2==0){
            vertices[i]+=x
        }
        else vertices[i]+=y
    };
}

// Generates points for a rhombus from a given point
// with height, width, and offset
function rhombusPoints(vertices, x1, y1, height, width, offset){
    vertices.push(x1, y1)
    vertices.push(x1+width, y1)
    vertices.push(x1+offset, y1+height)
    vertices.push(x1+width+offset, y1+height)
}

// Generates rectangle points from a given point
// with height and width
function rectanglePoints(vertices, x1, y1, height, width){
    vertices.push(x1, y1)
    vertices.push(x1, y1+height)
    vertices.push(x1+width, y1)
    vertices.push(x1+width, y1+height)
}

// Generates circle points given it's center,
// radius, thickness, and start angle
function circlePoints(vertices, a, b, r, thickness, startAngle, endAngle){
    for(let i=startAngle;i<=endAngle;i+=10){
        radian = i*Math.PI/180
        vertices.push(r*Math.cos(radian)+a)
        vertices.push(r*Math.sin(radian)+b)

        vertices.push((r+thickness)*Math.cos(radian)+a)
        vertices.push((r+thickness)*Math.sin(radian)+b)
    }
}

// Generates a cubic bezier curve given 
// set of control points and offsets
function getBezier(vertices, p, precision, limit, offsetX, offsetY){
    let offsetP = []

    for(let i=0;i<8;i++){
        if(i%2==0) offsetP.push(p[i]+offsetX)
        else offsetP.push(p[i]+offsetY)
    }

    for (let t=0;t<limit;t+=precision){
        temp = 1-t
        x = (Math.pow(temp, 3)*p[0])+(3*Math.pow(temp,2)*t*p[2])+(3*temp*Math.pow(t, 2)*p[4])+(Math.pow(t, 3)*p[6])
        y = (Math.pow(temp, 3)*p[1])+(3*Math.pow(temp,3)*t*p[3])+(3*temp*Math.pow(t, 2)*p[5])+(Math.pow(t, 3)*p[7])
        vertices.push(x)
        vertices.push(y)

        y = (Math.pow(temp, 3)*offsetP[1])+(3*Math.pow(temp,3)*t*offsetP[3])+(3*temp*Math.pow(t, 2)*offsetP[5])+(Math.pow(t, 3)*offsetP[7])
        x = (Math.pow(temp, 3)*offsetP[0])+(3*Math.pow(temp,2)*t*offsetP[2])+(3*temp*Math.pow(t, 2)*offsetP[4])+(Math.pow(t, 3)*offsetP[6])

        vertices.push(x)
        vertices.push(y)
    }
}

function main(){

    /** @type {HTMLCanvasElement} */
    
    var canvas = document.getElementById("kanvas")

    // // fullscreen
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetWidth

    var gl = canvas.getContext('webgl')
    var vertices= 
        [
            // 4's outline      clr
            -0.187, -0.22, 1, 1, 0, 0,    
            -0.186, -0.49, 1, 1, 0, 0,
            -0.121, -0.49, 1, 1, 0, 0, 
            -0.122, -0.54, 1, 1, 0, 0, 
            -0.186, -0.54, 1, 1, 0, 0, 
            -0.185, -0.6, 1, 1, 0, 0, 
            -0.123, -0.62, 1, 1, 0, 0, 
            -0.121, -0.65, 1, 1, 0, 0, 
            -0.315, -0.65, 1, 1, 0, 0, 
            -0.315, -0.63, 1, 1, 0, 0, 
            -0.247, -0.61, 1, 1, 0, 0, 
            -0.242, -0.54, 1, 1, 0, 0, 
            -0.408, -0.54, 1, 1, 0, 0, 
            -0.24, -0.24, 1, 1, 0, 0,
            // 4's  innner triangle
            -0.242, -0.3, 1, 1, 0, 0, 
            -0.35, -0.49, 1, 1, 0, 0, 
            -0.242, -0.49, 1, 1, 0, 0, 

            // 7
            // 0.692, -0.23,
            // 0.489, -0.65,
            // 0.417, -0.65,
            // 0.610, -0.29,
            // 0.459, -0.29,
            // 0.439, -0.36,
            // 0.416, -0.36,
            // 0.415, -0.23,
        ];

        var indices = [], indices_four = [], indices_svn = [], indices_e = [], indices_r = []

    // Preprocessing points

    // 4
    //  offset(vertices, -0.5, 1., 0, 17)
    // offset(vertices, -0.5, 1., 0, 14)
     generateLineIndices(indices_four, 0, 14)
     generateLineIndices(indices_four, 14, 17)
     d_vertices_four = []
     modifyZPosition(vertices, d_vertices_four, 0, 17, 0.5)
     vertices = vertices.concat(d_vertices_four)
     generateLineIndices(indices_four, 17, 31)
     generateLineIndices(indices_four, 31, 34)
     generateSideFacesIndex(indices_four, 0, 16, 17)

    //  7
    //  offset(vertices, -1., 1., 34, 8)


    // e
    // circlePoints(vertices, 0.5, -1.6, 0.09, 0.03, 90, 270)
    // rectanglePoints(vertices, 0.5, -1.51, 0.03, 0.1)
    // rectanglePoints(vertices, 0.39, -1.615, 0.03, 0.21)
    // rectanglePoints(vertices, 0.5, -1.72, 0.03, 0.1)
    // offset(vertices, -0.65, 2.08, 50, 50)
    
    // R
    // rectanglePoints(vertices, 0.45, -1.35, 0.04, 0.25)
    // rectanglePoints(vertices, 0.5, -1.35, -0.38, 0.03)
    // rectanglePoints(vertices, 0.56, -1.35, -0.38, 0.05)
    // rectanglePoints(vertices, 0.45, -1.73, 0.03, 0.25)
    // circlePoints(vertices, 0.7, -1.44, -0.09, -0.04, 90, 270)
    // rhombusPoints(vertices, 0.642, -1.55, -0.18, 0.06, 0.13)
    // rectanglePoints(vertices, 0.642, -1.53, -0.02, 0.07)
    // rectanglePoints(vertices, 0.78, -1.7, -0.03, 0.06)
    // offset(vertices, -0.35, 2.08, 150, 400)
    

    indices = indices.concat(indices_four)

    // WebGL stuff
    var buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    //  Vertex shader
    var vertexShaderCode 
    = `
    attribute vec3 aPosition;  
    attribute vec3 aColor;
    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    varying vec3 vColor;
    void main() {
        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
        vColor = aColor;
    }`

    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShaderObject, vertexShaderCode)
    gl.compileShader(vertexShaderObject)

    // Fragment shader
    var fragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;
    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
    `

    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode)
    gl.compileShader(fragmentShaderObject)

    var shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShaderObject)
    gl.attachShader(shaderProgram, fragmentShaderObject)
    gl.linkProgram(shaderProgram)
    gl.useProgram(shaderProgram)

    // camera

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
    glMatrix.mat4.perspective(perspective, Math.PI/7, 1.0, 0.5, 10.0);


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

    gl.clearColor(1.0, 1.0, 1.0, 1.0)

    gl.clear(gl.COLOR_BUFFER_BIT)


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
        gl.clearColor(0.0,      0.0,    0.0,    0.0);  // Oranye
        //            Merah     Hijau   Biru    Transparansi
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (!freeze) {
            theta += 0.001;
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
        gl.drawElements(gl.LINE_LOOP, 28, gl.UNSIGNED_SHORT, 0);
        gl.drawElements(gl.LINE_LOOP, 6, gl.UNSIGNED_SHORT, 56);
        gl.drawElements(gl.LINE_LOOP, 28, gl.UNSIGNED_SHORT, 68);
        gl.drawElements(gl.LINE_LOOP, 6, gl.UNSIGNED_SHORT, 124);
        gl.drawElements(gl.LINES, 128, gl.UNSIGNED_SHORT, 136);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    console.log(vertices)
    console.log(indices);
    console.log(gl.getError())



    // 4
    // gl.drawArrays(gl.LINE_LOOP, 0, 14)
    // gl.drawArrays(gl.LINE_LOOP, 14, 3)

    // 7
    // gl.drawArrays(gl.LINE_LOOP, 17, 8)

    // // E
    // gl.drawArrays(gl.TRIANGLE_STRIP, 25, 38)
    // gl.drawArrays(gl.TRIANGLE_STRIP, 63, 4)
    // gl.drawArrays(gl.TRIANGLE_STRIP, 67, 4)
    // gl.drawArrays(gl.TRIANGLE_STRIP, 71, 4)

    // // // R
    // gl.drawArrays(gl.TRIANGLE_STRIP, 75, 4)
    // gl.drawArrays(gl.TRIANGLE_STRIP, 79, 4)
    // gl.drawArrays(gl.TRIANGLE_STRIP, 83, 4)
    // gl.drawArrays(gl.TRIANGLE_STRIP, 87, 4)
    // gl.drawArrays(gl.TRIANGLE_STRIP, 91, 38)
    // gl.drawArrays(gl.TRIANGLE_STRIP, 129, 4)
    // gl.drawArrays(gl.TRIANGLE_STRIP, 133, 4)
    // gl.drawArrays(gl.TRIANGLE_STRIP, 137, 4)

}
