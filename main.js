// offset a set of vertices
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
            // 4's outline
            -0.187, -0.22,
            -0.186, -0.49,
            -0.121, -0.49,
            -0.122, -0.54,
            -0.186, -0.54,
            -0.185, -0.6,
            -0.123, -0.62,
            -0.121, -0.65,
            -0.315, -0.65,
            -0.315, -0.63,
            -0.247, -0.61,
            -0.242, -0.54,
            -0.408, -0.54,
            -0.24, -0.24,
            // 4's  innner triangle
            -0.242, -0.3,
            -0.35, -0.49,
            -0.242, -0.49,

            // 7
            0.692, -0.23,
            0.489, -0.65,
            0.417, -0.65,
            0.610, -0.29,
            0.459, -0.29,
            0.439, -0.36,
            0.416, -0.36,
            0.415, -0.23,
        ];

    
    // Preprocessing points

    // 4 and 7
     offset(vertices, -0.5, 1., 0, 17)
     offset(vertices, -1., 1., 34, 8)

    // e
    circlePoints(vertices, 0.5, -1.6, 0.09, 0.03, 90, 270)
    rectanglePoints(vertices, 0.5, -1.51, 0.03, 0.1)
    rectanglePoints(vertices, 0.39, -1.615, 0.03, 0.21)
    rectanglePoints(vertices, 0.5, -1.72, 0.03, 0.1)
    offset(vertices, -0.65, 2.08, 50, 50)
    
    // R
    rectanglePoints(vertices, 0.45, -1.35, 0.04, 0.25)
    rectanglePoints(vertices, 0.5, -1.35, -0.38, 0.03)
    rectanglePoints(vertices, 0.56, -1.35, -0.38, 0.05)
    rectanglePoints(vertices, 0.45, -1.73, 0.03, 0.25)
    circlePoints(vertices, 0.7, -1.44, -0.09, -0.04, 90, 270)
    rhombusPoints(vertices, 0.642, -1.55, -0.18, 0.06, 0.13)
    rectanglePoints(vertices, 0.642, -1.53, -0.02, 0.07)
    rectanglePoints(vertices, 0.78, -1.7, -0.03, 0.06)
    offset(vertices, -0.35, 2.08, 150, 400)
    

    // WebGL stuff
    var buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    //  Vertex shader
    var vertexShaderCode 
    = `
    attribute vec2 aPosition;
    void main(){
        // float x = aPosition.x;
        // float y = aPosition.y;
        gl_PointSize = 10.0;
        gl_Position = vec4(aPosition.xy, 0.0, 1.0);
    }`
    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShaderObject, vertexShaderCode)
    gl.compileShader(vertexShaderObject)
    // Fragment shader
    var fragmentShaderCode = `
    precision mediump float;
    void main(){
        float r = 0.0;
        float g = 0.0;
        float b = 0.0;
        gl_FragColor = vec4(r, g, b, 1.0);
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

    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition")
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(aPosition)
    gl.clearColor(1.0, 1.0, 1.0, 1.0)

    gl.clear(gl.COLOR_BUFFER_BIT)

    // 4
    gl.drawArrays(gl.LINE_LOOP, 0, 14)
    gl.drawArrays(gl.LINE_LOOP, 14, 3)

    // 7
    gl.drawArrays(gl.LINE_LOOP, 17, 8)

    // E
    gl.drawArrays(gl.TRIANGLE_STRIP, 25, 38)
    gl.drawArrays(gl.TRIANGLE_STRIP, 63, 4)
    gl.drawArrays(gl.TRIANGLE_STRIP, 67, 4)
    gl.drawArrays(gl.TRIANGLE_STRIP, 71, 4)

    // // R
    gl.drawArrays(gl.TRIANGLE_STRIP, 75, 4)
    gl.drawArrays(gl.TRIANGLE_STRIP, 79, 4)
    gl.drawArrays(gl.TRIANGLE_STRIP, 83, 4)
    gl.drawArrays(gl.TRIANGLE_STRIP, 87, 4)
    gl.drawArrays(gl.TRIANGLE_STRIP, 91, 38)
    gl.drawArrays(gl.TRIANGLE_STRIP, 129, 4)
    gl.drawArrays(gl.TRIANGLE_STRIP, 133, 4)
    gl.drawArrays(gl.TRIANGLE_STRIP, 137, 4)

}
