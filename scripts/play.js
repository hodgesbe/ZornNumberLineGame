/**
 * Created by Benjamin on 9/23/2015.
 */

//  DEBUG - Detect webgl
try{
    webgl_detect();
} catch(e) {}

function init(){

}
//  Resize factor
var resReduce = 4;

//  Get window size from browser
var canvasWidth = window.innerWidth / resReduce;
var canvasHeight = window.innerHeight / resReduce;


//  Create a renderer object
var renderer = new THREE.WebGLRenderer({antialias:true});
//  Set the size of the renderer to the window size from above
renderer.setSize(canvasWidth , canvasHeight);
renderer.setClearColor(0x000000,1);
//  Attache the renderer to the DOM
document.body.appendChild(renderer.domElement);

//  Create a new scene
var scene = new THREE.Scene();

//  Create a new camera using PerspectiveCamera(FOV, ratio, closestDrawableObject, farthestDrawableObject);
//  Field Of View, Ratio (usually canvasHeight/canvasWidth)
var camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);

//  Position the camera in relation to the origin
camera.position.y = 160;
camera.position.z = 400;    //  Z coordinate is the positive direction towards the viewer (ie: higher = closer)

//  Add camera to scene
scene.add(camera);

//  Create cube and material objects
var cubeGeometry = new THREE.CubeGeometry(10,10,10);
var cubeMaterial = new THREE.MeshLambertMaterial( {color: 0x1ec876} );
//  Use the cube and material objects to create a new mesh
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

//  Position the cube to the origin
cube.rotation.y = Math.PI * 15 / 180;

//  Add the cube to the scene
scene.add(cube);

//  Render the scene
renderer.render(scene, camera);




//  DEBUGGING CODE
function webgl_detect()
{
    if (!!window.WebGLRenderingContext) {
        var canvas = document.createElement("canvas"),
            names = ["webgl", "experimental-webgl", "moz-webgl"],
            gl = false;

        for(var i in names) {
            try {
                gl = canvas.getContext(names[i]);
                if (gl && typeof gl.getParameter == "function") {
                    /* WebGL is enabled */
                    /* return true; */
                    return names[i];
                }
            } catch(e) {}
        }

        /* WebGL is supported, but disabled */
        return false;
    }

    /* WebGL not supported*/
    return false;
}