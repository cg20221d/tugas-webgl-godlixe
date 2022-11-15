// Modifies the color of vertices from start to
// start+numPoints
function modifyColor(vertices, start, numPoints, r, g, b){
    for(let i=start;i<start+(numPoints*6);i++){
        if((i+3)%6==0){
            vertices[i]=r
        }
        else if((i+2)%6==0) vertices[i]=g
        else if((i+1)%6==0) vertices[i]=b
    };
}

// Generates side faces for line primitive
function generateSideFacesIndex(indicesArr, start, end, offset){
    for(let i=start;i<end;i++){
        indicesArr.push(i, i+offset)
        indicesArr.push(i, i+1)
        indicesArr.push(i+1, i+offset+1)
        indicesArr.push(i+offset+1, i+offset)
    }
    // handle last indices
    indicesArr.push(end, end+offset)
    indicesArr.push(end, start)
    indicesArr.push(start, start+offset)
    indicesArr.push(end+offset, start+offset)
}

// Generates side faces for triangle primitive
function generateTriangleSideFacesIndex(indicesArr, start, end, offset){
    // handle even indices
    for(let i=start;i<end-2;i+=2){

        indicesArr.push(i, i+offset, i+2)
        indicesArr.push(i+offset, i+2, i+offset+2)
    }
    // handle odd indices
    for(let i=start+1;i<end-2;i+=2){
        indicesArr.push(i, i+offset, i+2)
        indicesArr.push(i+offset, i+2, i+offset+2)
    }
    // handle top indices
    indicesArr.push(start, start+offset, start+1)
    indicesArr.push(start+offset, start+1, start+1+offset)

    // // handle bottom indices
    indicesArr.push(end-2, end+offset-2, end-1)
    indicesArr.push(end+offset-2, end-1, end+offset-1)
}

// Modifies the z position of a set of vertices with color
function modifyZPosition(src_vertices, dst_vertices, start, numPoints, newZ){
    for(let i = start;i<start+6*(numPoints);i++){
        if((i+4)%6==0) dst_vertices.push(newZ)
        else dst_vertices.push(src_vertices[i])
    }
}

// Generates indices for line primitive
function generateLineIndices(indicesArr, start_idx, last_idx){
    indicesArr.push(start_idx)
    for(let i=start_idx+1;i<last_idx;i++){
        indicesArr.push(i, i)
    }
    indicesArr.push(start_idx)
}

// Generates indices for tirangle primitive
function generateTriangleIndices(indicesArr, start_idx, last_idx){
    for(let i=start_idx+1;i<last_idx;i++){
        indicesArr.push(i-1, i, i+1)
    }
}

// Offset a set of vertices
// from start to start+numpoints*2
function offset(vertices, x, y, start, numPoints){
    for(let i=start;i<start+(numPoints*6);i++){
        if((i+6)%6==0){
            vertices[i]+=x
        }
        else if((i+5)%6==0) vertices[i]+=y
    };
}

// Generates points for a rhombus from a given point
// with height, width, and offset
function rhombusPoints(vertices, x1, y1, z, height, width, offset, r, g, b){
    vertices.push(x1, y1, z, r, g, b)
    vertices.push(x1+width, y1, z, r, g, b)
    vertices.push(x1+offset, y1+height, z, r, g, b)
    vertices.push(x1+width+offset, y1+height, z, r, g, b)
}

// Generates rectangle points from a given point
// with height and width
function rectanglePoints(vertices, x1, y1, z, height, width, r, g, b){
    vertices.push(x1, y1, z, r, g, b)
    vertices.push(x1, y1+height, z, r, g, b)
    vertices.push(x1+width, y1, z, r, g, b)
    vertices.push(x1+width, y1+height, z, r, g, b)
}

// Generates circle points given it's center,
// radius, thickness, and start angle
function circlePoints(vertices, a, b, r, thickness, startAngle, endAngle, z, red, green, blue){
    for(let i=startAngle;i<=endAngle;i+=10){
        radian = i*Math.PI/180
        vertices.push(r*Math.cos(radian)+a)
        vertices.push(r*Math.sin(radian)+b)
        vertices.push(z, red, green, blue)

        vertices.push((r+thickness)*Math.cos(radian)+a)
        vertices.push((r+thickness)*Math.sin(radian)+b)
        vertices.push(z, red, green, blue)
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
    var vertices = []
    var vertices_four = 
        [
            // 4's outline      clr
            -0.187, -0.22, 1, 1, 0, 0,   //0  
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
            -0.24, -0.24, 1, 1, 0, 0, //13
            // 4's  innner triangle
            -0.242, -0.3, 1, 1, 0, 0, //14
            -0.35, -0.49, 1, 1, 0, 0, 
            -0.242, -0.49, 1, 1, 0, 0 //16
        ];

        var indices = [], indices_four = [], indices_svn = [], indices_e = [], indices_r = [];
        var num_prev_vertices = 0, num_prev_index = 0;

        // Preprocessing points
        
        // 4
        //  offset(vertices, -0.5, 1., 0, 17)
        // offset(vertices, -0.5, 1., 0, 14)
        modifyColor(vertices_four, 0, 17, 0.160, 0.650, 1.00)
        generateLineIndices(indices_four, 0, 14)
        generateLineIndices(indices_four, 14, 17)
        var d_vertices_four = []
        modifyZPosition(vertices_four, d_vertices_four, 0, 17, 0.96)
        vertices_four = vertices_four.concat(d_vertices_four)
        offset(vertices_four, 0, .5, -0, 34)
        generateLineIndices(indices_four, 17, 31)
        generateLineIndices(indices_four, 31, 34)
        generateSideFacesIndex(indices_four, 0, 13, 17)
        generateSideFacesIndex(indices_four, 14, 16, 17)
        
        // num_prev_vertices+=vertices_four.length/6
        // console.log(num_prev_vertices)
        
     var vertices_svn = [
         // 7
         0.692, -0.23, 1, 0, 0.65, 0.65, //34
         0.489, -0.65, 1, 0, 0.65, 0.65,
         0.417, -0.65, 1, 0, 0.65, 0.65,
         0.610, -0.29, 1, 0, 0.65, 0.65,
         0.459, -0.29, 1, 0, 0.65, 0.65,
         0.439, -0.36, 1, 0, 0.65, 0.65,
         0.416, -0.36, 1, 0, 0.65, 0.65,
         0.415, -0.23, 1, 0, 0.65, 0.65 //41
        ]
        modifyColor(vertices_svn, 0, 8, 1.00, 0.160, 0.930)


        offset(vertices_svn, -0.1, 0.5, -0, 8)
        //  7
        generateLineIndices(indices_svn, 34, 42)
        var d_vertices_svn = []
        modifyZPosition(vertices_svn, d_vertices_svn, 0, 8, 0.95)
        vertices_svn = vertices_svn.concat(d_vertices_svn)
        generateLineIndices(indices_svn, 42, 50)
        generateSideFacesIndex(indices_svn, 34, 41, 8)
        // offset(vertices, -1., 1., 34, 8)
        
        var vertices_e = []
        // e
        circlePoints(vertices_e, 0.5, -1, 0.5, 0.2, 90, 270, 1, 0.4, 0.2, 0.4)
        rectanglePoints(vertices_e, 0.5, -0.5, 1, 0.2, 0.5, 0.4, 0.2, 0.4)
        rectanglePoints(vertices_e, 0, -1.1, 1, 0.2, 1, 0.4, 0.2, 0.4)
        rectanglePoints(vertices_e, 0.5, -1.7, 1, 0.2, 0.5, 0.4, 0.2, 0.4)
        modifyColor(vertices_e, 0, 50, 0.594, 0.990, 0.759)
        offset(vertices_e, -2, -1.5, -0, 50)
        generateTriangleIndices(indices_e, 50, 87)
        generateTriangleIndices(indices_e, 88, 91)
        generateTriangleIndices(indices_e, 92, 95)
        generateTriangleIndices(indices_e, 96, 99)
        
        var d_vertices_e = []
        modifyZPosition(vertices_e, d_vertices_e, 0, 50, 0.9)
        // console.log(d_vertices_e)
        vertices_e = vertices_e.concat(d_vertices_e)
        generateTriangleIndices(indices_e, 100, 137)
        generateTriangleIndices(indices_e, 138, 141)
        generateTriangleIndices(indices_e, 142, 145)
        generateTriangleIndices(indices_e, 146, 149)

        generateTriangleSideFacesIndex(indices_e, 50, 88, 50)
        generateTriangleSideFacesIndex(indices_e, 88, 92, 50)
        generateTriangleSideFacesIndex(indices_e, 92, 96, 50)
        generateTriangleSideFacesIndex(indices_e, 96, 100, 50)
        // offset(vertices, -0.65, 2.08, 50, 50)
        
        // R
        var vertices_r = []
        rectanglePoints(vertices_r, 0.45, -1.35, 1, 0.04, 0.25, 0, 0.65, 1)
        rectanglePoints(vertices_r, 0.5, -1.35, 1, -0.38, 0.03, 0, 0, 0)
        rectanglePoints(vertices_r, 0.56, -1.35, 1, -0.38, 0.05, 0, 0, 0)
        rectanglePoints(vertices_r, 0.45, -1.73, 1, 0.03, 0.25, 0, 0, 0)
        offset(vertices_r, -0.35, 1.08, 0, 16)
        
        circlePoints(vertices_r, 0.35, -0.36, -0.09, -0.04, 90, 270, 1, 0, 0, 0) //38
        
        rhombusPoints(vertices_r, 0.32, -0.47, 1, -0.18, 0.06, 0.13, 0, 0, 0)
        rectanglePoints(vertices_r, 0.32, -0.45, 1, -0.02, 0.07, 0, 0, 0)
        rectanglePoints(vertices_r, 0.45, -0.62, 1, -0.03, 0.06, 0, 0, 0)
        
        modifyColor(vertices_r, 0, 66, 0.930, 0.648, 0.279)

        generateTriangleIndices(indices_r, 150, 153)
        generateTriangleIndices(indices_r, 154, 157)
        generateTriangleIndices(indices_r, 158, 161)
        generateTriangleIndices(indices_r, 162, 165)
        generateTriangleIndices(indices_r, 166, 203)
        generateTriangleIndices(indices_r, 204, 207)
        generateTriangleIndices(indices_r, 208, 211)
        generateTriangleIndices(indices_r, 212, 215)
        
        var d_vertices_r = []
        modifyZPosition(vertices_r, d_vertices_r, 0, 66, 0.95)
        vertices_r = vertices_r.concat(d_vertices_r)
        generateTriangleIndices(indices_r, 216, 219)
        generateTriangleIndices(indices_r, 220, 223)
        generateTriangleIndices(indices_r, 224, 227)
        generateTriangleIndices(indices_r, 228, 231)

        generateTriangleIndices(indices_r, 232, 269)

        generateTriangleIndices(indices_r, 270, 273)
        generateTriangleIndices(indices_r, 274, 277)
        generateTriangleIndices(indices_r, 278, 281)

        generateTriangleSideFacesIndex(indices_r, 150, 154, 66)
        generateTriangleSideFacesIndex(indices_r, 154, 158, 66)
        generateTriangleSideFacesIndex(indices_r, 158, 162, 66)
        generateTriangleSideFacesIndex(indices_r, 162, 166, 66)
        generateTriangleSideFacesIndex(indices_r, 166, 204, 66)
        generateTriangleSideFacesIndex(indices_r, 204, 208, 66)
        generateTriangleSideFacesIndex(indices_r, 208, 212, 66)
        generateTriangleSideFacesIndex(indices_r, 212, 216, 66)

    
    vertices = vertices.concat(vertices_four, vertices_svn, vertices_e, vertices_r)
    indices = indices.concat(indices_four, indices_svn, indices_e, indices_r)
    
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
    var thetaX = 0.0, thetaY = 0.0;
    var freeze = false;
    var horizontalSpeed = 0.0;
    var verticalSpeed = 0.0;
    var horizontalDelta = 0.0;
    var verticalDelta = 0.0;

    // Variabel pointer ke GLSL
    var uModel = gl.getUniformLocation(shaderProgram, "uModel");
    // View
    var cameraX = 0.0;
    var cameraZ = 7.5;
    var uView = gl.getUniformLocation(shaderProgram, "uView");
    var view = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(
        view,
        [cameraX, -1.0, cameraZ],    // the location of the eye or the camera
        [cameraX, -1.0, 0],        // the point where the camera look at
        [0.0, 1.0, 0.0]
    );
    // Projection
    var uProjection = gl.getUniformLocation(shaderProgram, "uProjection");
    var perspective = glMatrix.mat4.create();
    glMatrix.mat4.perspective(perspective, 5*Math.PI/12, 1.0, 0.5, 50.0);


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

    // gl.clearColor(0.1,      0.2,    0.1,    1.0);  // Oranye
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.clearColor(1.0, 1.0, 1.0, 1.0)

    // gl.clear(gl.COLOR_BUFFER_BIT)


        // Grafika interaktif
    // Tetikus
    function onMouseClick(event) {
        freeze = !freeze;
    }
    document.addEventListener("click", onMouseClick);
    // Papan ketuk
    function onKeydown(event) {
        if (event.keyCode == 32) freeze = !freeze;  // spasi
        // Gerakan horizontal: a/left ke kiri, d/right ke kanan
        if (event.keyCode == 65 || event.keyCode == 37) {  // a
            thetaY += 0.05;
        } else if (event.keyCode == 68 || event.keyCode == 39) {   // d
            thetaY -= 0.05;
        }
        // Gerakan vertikal: w/up ke atas, s/down ke bawah
        if (event.keyCode == 87 || event.keyCode == 38) {  // w
            thetaX -= 0.05;
        } else if (event.keyCode == 83 || event.keyCode == 40) {   // s
            thetaX += 0.05;
        }
    }
    function onKeyup(event) {
        if (event.keyCode == 32) freeze = !freeze;
    }

    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);
    
    var isGoingRight = true, isScaling = true
    var scaleX = 4, scaleY = 4, scaleZ = 4
    function render() {
        gl.enable(gl.DEPTH_TEST);
        //            Merah     Hijau   Biru    Transparansi
        gl.clearColor(0,      0,    0.1,    1.0);  // Oranye
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        horizontalDelta += horizontalSpeed;
        verticalDelta -= verticalSpeed;
        // console.log(theta, horizontalDelta, verticalDelta, horizontalSpeed, verticalSpeed)
        var model = glMatrix.mat4.create(); // Membuat matriks identitas
        glMatrix.mat4.translate(
            model, model, [horizontalDelta, 0.0, 0.0]
        );
        glMatrix.mat4.scale(
            model, model, [4, 4, 4]
        );
        glMatrix.mat4.rotateX(
            model, model, 0
        );
        glMatrix.mat4.rotateY(
            model, model, 0
        );
        glMatrix.mat4.rotateZ(
            model, model, 0
        );
        gl.uniformMatrix4fv(uModel, false, model);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        gl.drawElements(gl.LINES, 112, gl.UNSIGNED_SHORT, 136);
        gl.drawElements(gl.LINES, 24, gl.UNSIGNED_SHORT, 360);

        // 7
        var model_svn = glMatrix.mat4.create(); // Membuat matriks identitas
        glMatrix.mat4.translate(
            model_svn, model_svn, [-0.5, 0.0, 0.0]
        );
        glMatrix.mat4.scale(
            model_svn, model_svn, [scaleX, scaleY, scaleZ]
        );
        glMatrix.mat4.rotateX(
            model_svn, model_svn, 0
        );
        glMatrix.mat4.rotateY(
            model_svn, model_svn, 0
        );
        glMatrix.mat4.rotateZ(
            model_svn, model_svn, 0
        );
        gl.uniformMatrix4fv(uModel, false, model_svn);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        gl.drawElements(gl.LINES, 64, gl.UNSIGNED_SHORT, 472);

        // e
        var model_e = glMatrix.mat4.create(); // Membuat matriks identitas
        glMatrix.mat4.translate(
            model_e, model_e, [0, 0, 0]
        );
        glMatrix.mat4.scale(
            model_e, model_e, [1.2, 1.2, 1.2]
        );
        glMatrix.mat4.rotateX(
            model_e, model_e, 0
        );
        glMatrix.mat4.rotateY(
            model_e, model_e, thetaY
        );
        glMatrix.mat4.rotateZ(
            model_e, model_e, 0
        );
        gl.uniformMatrix4fv(uModel, false, model_e);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        gl.drawElements(gl.TRIANGLE_STRIP, 108, gl.UNSIGNED_SHORT, 600);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 816);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 828);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 840);

        gl.drawElements(gl.TRIANGLE_STRIP, 108, gl.UNSIGNED_SHORT, 852);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 1068);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 1080);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 1092);

        // side face
        gl.drawElements(gl.TRIANGLES, 228, gl.UNSIGNED_SHORT, 1104);
        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 1560);
        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 1608);
        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 1656);


        // R
        var model_r = glMatrix.mat4.create(); // Membuat matriks identitas
        glMatrix.mat4.translate(
            model_r, model_r, [0, 0, 0]
        );
        glMatrix.mat4.scale(
            model_r, model_r, [4, 4, 4]
        );
        glMatrix.mat4.rotateX(
            model_r, model_r, thetaX
        );
        glMatrix.mat4.rotateY(
            model_r, model_r, 0
        );
        glMatrix.mat4.rotateZ(
            model_r, model_r, 0
        );
        gl.uniformMatrix4fv(uModel, false, model_r);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 1704);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 1716);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 1728);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 1740);
        gl.drawElements(gl.TRIANGLE_STRIP, 108, gl.UNSIGNED_SHORT, 1752);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 1968);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 1980);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 1992);

        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 2004);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 2016);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 2028);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 2040);
        gl.drawElements(gl.TRIANGLE_STRIP, 108, gl.UNSIGNED_SHORT, 2052);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 2268);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 2280);
        gl.drawElements(gl.TRIANGLE_STRIP, 6, gl.UNSIGNED_SHORT, 2292);

        // side face
        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 2304);
        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 2352);
        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 2400);
        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 2448);
        gl.drawElements(gl.TRIANGLES, 228, gl.UNSIGNED_SHORT, 2496);
        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 2952);
        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 3000);
        gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 3048);


        requestAnimationFrame(render);

        if (!freeze) {
            if(model[12]>=3.5 && isGoingRight) isGoingRight = false
            else if(model[12] <= -1.5) isGoingRight = true
            if(isGoingRight){
                horizontalDelta+=0.0247
            }
            else {
                horizontalDelta-=0.0247
            }

            if(scaleX>=4) isScaling = false
            else if(scaleX<=3) isScaling = true
            if(isScaling){
                scaleX+=0.01
                scaleY+=0.01
                scaleZ+=0.01
            }
            else if(!isScaling) {
                scaleX-=0.01
                scaleY-=0.01
                scaleZ-=0.01
            }
        }
    }
    requestAnimationFrame(render);
    console.log(gl.getError())
}
