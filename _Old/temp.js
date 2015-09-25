/**
 * Created by Benjamin on 9/23/2015.
 */

//  DEBUG - Detect webgl
//try{
//    webgl_detect();
//} catch(e) {}

function init(){
//  Resize factor
    var canvasSizeReduce = 1;
//  Get window size from browser
    var canvasWidth = window.innerWidth / canvasSizeReduce;
    var canvasHeight = window.innerHeight / canvasSizeReduce;

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(canvasWidth/-2, canvasWidth/2, canvasHeight/2, canvasHeight/-2,0.1,1000);
//    var camera = new THREE.OrthographicCamera(canvasWidth, canvasWidth, canvasHeight, canvasHeight,0.1,1000);
//    var camera = new THREE.OrthographicCamera(canvasWidth/-4, canvasWidth/4, canvasHeight/4, canvasHeight/-4,0.1,1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(window.innerWidth, window.innerHeight);

    var axes = new THREE.AxisHelper(20);
    scene.add(axes);

    //  Sprite
    var bgTexture = new THREE.ImageUtils.loadTexture('assets/artwork/Initial_PreMockup-01-01.png');
    var bgMaterial = new THREE.SpriteMaterial( { map: bgTexture } );
    var bgSprite = new THREE.Sprite();
    bgSprite.add(bgMaterial);
    bgSprite.position.x = canvasWidth;
    bgSprite.position.y = canvasHeight;
    bgSprite.scale.set(64,64,1.0);
    scene.add(bgSprite);

    //  Plane
    var planeGeometry = new THREE.PlaneGeometry(canvasWidth/3, canvasHeight/3, 1, 1);
    var planeMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('assets/artwork/Initial_PreMockup-01-01.png') } );
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

//    var bgImage = new THREE.ImageUtils.loadTexture('assets/artwork/Initial_PreMockup-01-01.jpg',)
    plane.position.x = 15
    plane.position.y = 0
    plane.position.z = 0

    //scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(10, 10, 10)
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 1;

    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;

    scene.add(sphere);

    var ambientLight = new THREE.SpotLight();
    ambientLight.position.x = 0;
    ambientLight.position.y = 0;
    ambientLight.position.z = 4;

    scene.add(ambientLight);

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    document.getElementById("WebGL-output")
        .appendChild(renderer.domElement);
    renderer.render(scene, camera);
}
//  DEBUGGING CODE
/*
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
                    /!* WebGL is enabled *!/
                    /!* return true; *!/
                    return names[i];
                }
            } catch(e) {}
        }

        /!* WebGL is supported, but disabled *!/
        return false;
    }

    /!* WebGL not supported*!/
    return false;
}*/
