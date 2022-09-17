function offset(vertices, x, y, start, numPoints){
    for(let i=start;i<start+(numPoints*2);i++){
        if(i%2==0){
            vertices[i]+=x
        }
        else vertices[i]+=y
    };
}

function getPt(p1, p2, precision){
    return p1+(p2-p1)*precision
}

function getBezier(vertices, bezierPoints1, bezierPoints2, precision, limit){
    for (let i=0;i<limit;i+=precision){
        // // Green line
        xa = getPt( bezierPoints1[0] , bezierPoints1[2] , i );
        ya = getPt( bezierPoints1[1] , bezierPoints1[3] , i );
        xb = getPt( bezierPoints1[2] , bezierPoints1[4] , i );
        yb = getPt( bezierPoints1[3] , bezierPoints1[5] , i );

        // Black Dot
        x = getPt( xa , xb , i );
        y = getPt( ya , yb , i );
        vertices.push(x)
        vertices.push(y)

        xa = getPt( bezierPoints2[0] , bezierPoints2[2] , i );
        ya = getPt( bezierPoints2[1] , bezierPoints2[3] , i );
        xb = getPt( bezierPoints2[2] , bezierPoints2[4] , i );
        yb = getPt( bezierPoints2[3] , bezierPoints2[5] , i );

        // Black Dot
        x = getPt( xa , xb , i );
        y = getPt( ya , yb , i );
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

            // E
            // 0.3, -1.0,
            // -0.1, -1.3,
            // 0.6, -2,

            // 0.5, -1.0,
            // 0.2, -1.3,
            // 0.8, -2
        ];

    
    // Preprocessing points
     offset(vertices, -0.5, 1., 0, 17)
     offset(vertices, -0.9, 1., 34, 8)

     bezierPoints1 = [
        0.3, -1.0,
        -0.1, -1.3,
        0.6, -2
     ]

     bezierPoints2 = [
        0.5, -1.0,
        0.2, -1.3,
        0.8, -2
     ]

        getBezier(vertices, 
            bezierPoints1, bezierPoints2, 0.01, 1)
offset(vertices, -0.0, 1., 50, 1000)
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
    gl.drawArrays(gl.TRIANGLE_STRIP, 25, 1000)

}
