/**
 * Created by Benjamin on 9/23/2015.
 */

//  DEBUG - Detect webgl
try{
    webgl_detect();
} catch(e) {}

function init(){
//  Resize factor
    var canvasSizeReduce = 1;
//  Get window size from browser
    var canvasWidth = window.innerWidth / canvasSizeReduce;
    var canvasHeight = window.innerHeight / canvasSizeReduce;

//  Create a new scene
    var scene = new THREE.Scene();

//  Create a new camera using PerspectiveCamera(FOV, ratio, closestDrawableObject, farthestDrawableObject);
//  Field Of View, Ratio (usually canvasHeight/canvasWidth)
    var camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);

//  Create a renderer object
    var renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(canvasWidth , canvasHeight);

//  New Geometry Object
    var planeGeometry = new THREE.PlaneGeometry(60,20,1,1);
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    var plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

//  New Geometry Object
    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);

    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    scene.add(cube);

//  New Light Object
    var spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 60, -10);

    scene.add(spotLight);

//  Position the camera in relation to the origin
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;  //  Z coordinate is the positive direction towards the viewer (ie: higher = closer)
    camera.lookAt(scene.position);


//  Attache the renderer to the DOM
    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    renderer.render(scene, camera);


//  Add camera to scene
    scene.add(camera);

}
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