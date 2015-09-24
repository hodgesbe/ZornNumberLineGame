/**
 * Created by Benjamin on 9/23/2015.
 */

//  DEBUG - Detect webgl
//try{
//    webgl_detect();
//} catch(e) {}

function init(){
//  Size constants
    var SCREEN_SCALE = 1;
    var SCREEN_WIDTH = window.innerWidth / SCREEN_SCALE;
    var SCREEN_HEIGHT = window.innerHeight / SCREEN_SCALE;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;

//  SCENE
    var scene = new THREE.Scene();
//  CAMERA
    //var camera = new THREE.OrthographicCamera(SCREEN_WIDTH/-2, SCREEN_WIDTH/2, SCREEN_HEIGHT/2, SCREEN_HEIGHT/-2,NEAR,FAR);
    var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0,150,400);
    camera.lookAt(scene.position);

//  RENDERER
    if (Detector.webgl){
        var renderer = new THREE.WebGLRenderer( {antialias: true} );
    }
    else{
        var renderer = new THREE.CanvasRenderer();
    }
    renderer.setSize(SCREEN_WIDTH,SCREEN_HEIGHT);
    var game = document.getElementById('WebGL-output');
    game.appendChild(renderer.domElement);

//  EVENTS
    THREEx.WindowResize(renderer, camera);
    THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

//  CONTROLS        *** TO BE IMPLEMENTED ***
    var controls = new THREE.OrbitControls( camera, renderer.domElement );

    // STATS
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    game.appendChild( stats.domElement );


//  LIGHTS
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,250,0);
    scene.add(light);

/*//  BACKGROUND
    var bgTexture = new THREE.ImageUtils.loadTexture('assets/artwork/Initial_PreMockup-01-01.png');
    bgTexture.wropS = bgTexture.wropT = THREE.ClampToEdgeWrapping;
    bgTexture.repeat.set(10,10);
    var bgMaterial = new THREE.MeshBasicMaterial( { map: bgTexture, side: THREE.DoubleSide } );
    //var bgMaterial = new THREE.MeshBasicMaterial( { map: bgTexture } );
    var bgGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
    var background = new THREE.Mesh(bgGeometry, bgMaterial);
    //background.position.y = -5;
    //background.rotation.x = Math.PI / 2;
    scene.add(background);*/

    // FLOOR
    var floorTexture = new THREE.ImageUtils.loadTexture( 'assets/artwork/Initial_PreMockup-01-01.png' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 10, 10 );
    var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    var axes = new THREE.AxisHelper(2000);
    scene.add(axes);


    //////
    //requestAnimationFrame( this );
    renderer.render( scene, camera );
    controls.update();
    stats.update();
}


/*
function animate()
{
    requestAnimationFrame( animate );
    render();
    update();
}

function update()
{
    if ( keyboard.pressed("z") )
    {
        // do something
    }

    controls.update();
    stats.update();
}

function render()
{
    renderer.render( scene, camera );
}*/
