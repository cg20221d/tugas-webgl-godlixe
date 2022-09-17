function offset(vertices, x, y, start, numPoints){
    for(let i=start;i<start+numPoints*2;i++){
        if(i%2==0){
            vertices[i]+=x
        }
        else vertices[i]+=y
    };
}


function main(){
    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById("kanvas")

    // // fullscreen
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetWidth

    var gl = canvas.getContext('webgl')
    var vertices_nrp= 
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
     offset(vertices_nrp, -0.5, 1., 0, 17)
     offset(vertices_nrp, -0.9, 1., 34, 50)
    var buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_nrp), gl.STATIC_DRAW)
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
    gl.drawArrays(gl.LINE_LOOP, 0, 14)
    gl.drawArrays(gl.LINE_LOOP, 14, 3)

    gl.drawArrays(gl.LINE_LOOP, 17, 8)

}
