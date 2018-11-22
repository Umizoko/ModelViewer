import {
    Engine,
    Scene,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    ArcRotateCamera,
    StandardMaterial,
    Color3,
    Color4,
    Mesh,
    CubeTexture,
    Texture,
    HDRCubeTexture,
    Material,
    FresnelParameters,
    GLTF2Export,
    SceneLoader
} from "babylonjs";

// Debug Layer
import "babylonjs-inspector"

// gltf2.0
import "babylonjs-serializers"

// loaders
import "babylonjs-loaders"

export default class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: ArcRotateCamera;
    private _light: HemisphericLight;

    private _sphere: any;
    private _box: any;

    // TODO: gltf Modelの読み込み

    /**
     *
     */
    constructor( canvasElement: string ) {
        // canvasDOMを取得
        this._canvas = document.getElementById( canvasElement ) as HTMLCanvasElement;
        // 3Dエンジン取得
        this._engine = new Engine( this._canvas, true );
    }

    createScene(): void {
        // Scene
        this._scene = new Scene( this._engine );
        // this._scene.clearColor = new Color4( 0.2, 0.2, 0.2, 1 );
        // this._scene.ambientColor = new Color3( 0.3, 0.3, 0.3 );

        // Debug
        this._scene.debugLayer.show();

        // Camera
        this._camera = new ArcRotateCamera(
            "Camera",
            -Math.PI / 2,
            Math.PI / 3,
            10,
            Vector3.Zero(),
            this._scene
        );

        this._camera.setTarget( Vector3.Zero() );

        this._camera.attachControl( this._canvas, false );

        // Light
        this._light = new HemisphericLight(
            "light",
            new Vector3( 0, 1, 0 ),
            this._scene
        );

        // Mesh

        // 球体
        // {
        //     this._sphere = MeshBuilder.CreateSphere(
        //         "sphere", {
        //             segments: 16,
        //             diameter: 2
        //         },
        //         this._scene
        //     );

        //     this._sphere.position.y = 1;

        //     // Material
        //     const myMaterial = new StandardMaterial( "myMaterial", this._scene );
        //     myMaterial.diffuseColor = new Color3( 0.8, 0.8, 0.8 );
        //     myMaterial.specularColor = new Color3( 0.5, 0.6, 0.7 );
        //     myMaterial.emissiveColor = new Color3( 0.2, 0.2, 0.2 );
        //     myMaterial.ambientColor = new Color3( 0.2, 0.9, 0.5 );

        //     myMaterial.reflectionTexture = new HDRCubeTexture(
        //         "/assets/skybox/HDR_111_Parking_Lot_2_Ref.hdr",
        //         this._scene,
        //         512
        //     );

        //     myMaterial.reflectionFresnelParameters = new FresnelParameters();
        //     myMaterial.reflectionFresnelParameters.bias = 0.1;
        //     myMaterial.reflectionTexture.level = 3;

        //     myMaterial.emissiveFresnelParameters = new FresnelParameters();
        //     myMaterial.emissiveFresnelParameters.bias = 0.5;
        //     myMaterial.emissiveFresnelParameters.power = 4;

        //     this._sphere.material = myMaterial;
        // }

        // 地面
        let ground = MeshBuilder.CreateGround(
            "ground", {
                width: 10,
                height: 10,
                subdivisions: 5
            },
            this._scene
        );

        // Box
        // {
        //     this._box = MeshBuilder.CreateBox( 'box', {
        //         height: 5,
        //         width: 2,
        //         depth: 0.5,
        //     }, this._scene );

        //     // Material
        //     const myMaterial = new StandardMaterial( 'myMaterial', this._scene );
        //     myMaterial.diffuseColor = new Color3( 0.2, 0.2, 0.2 );
        //     myMaterial.specularColor = new Color3( 0.5, 0.6, 0.7 );
        //     // myMaterial.emissiveColor = new Color3( 0.2, 0.2, 0.2 );
        //     // myMaterial.ambientColor = new Color3( 0.2, 0.9, 0.5 );

        //     this._box.material = myMaterial;
        // }

        // Custom Param Shape
        let myPoints = [];

        var point1 = new Vector3( -1, 0, 0 );
        var point2 = new Vector3( 0, 1, 1 );
        var point3 = new Vector3( 1, 1, 0 );

        myPoints.push( point1 );
        myPoints.push( point2 );
        myPoints.push( point3 );

        // const lines = MeshBuilder.CreateLines( 'line', {
        //         points: myPoints
        //     },
        //     this._scene );

        // lines.position.x = 1;
        // lines.color = new Color3( 1, 0.7, 0.7 );

        // skybox
        // const skybox = Mesh.CreateBox( "skyBox", 100.0, this._scene );
        // const skyboxMaterial = new StandardMaterial( "skyBox", this._scene );
        // skyboxMaterial.backFaceCulling = false;
        // skyboxMaterial.disableLighting = true;
        // skybox.material = skyboxMaterial;

        // skybox.infiniteDistance = true;


        // Environment Texture
        const hdrTexture = new HDRCubeTexture(
            "/assets/skybox/HDR_111_Parking_Lot_2_Ref.hdr",
            this._scene,
            1024
        );

        // Skybox
        var hdrSkybox = BABYLON.Mesh.CreateBox( "hdrSkyBox", 1000.0, this._scene );
        var hdrSkyboxMaterial = new BABYLON.PBRMaterial( "skyBox", this._scene );
        hdrSkyboxMaterial.backFaceCulling = false;
        hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
        hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        hdrSkyboxMaterial.microSurface = 1.0;
        hdrSkyboxMaterial.cameraExposure = 0.66;
        hdrSkyboxMaterial.cameraContrast = 1.66;
        hdrSkyboxMaterial.disableLighting = true;
        hdrSkybox.material = hdrSkyboxMaterial;
        hdrSkybox.infiniteDistance = true;

        // Create meshes
        var sphereGlass = BABYLON.Mesh.CreateSphere( "sphereGlass", 48, 80.0, this._scene );

        // Create materials
        var glass = new BABYLON.PBRMaterial( "glass", this._scene );
        glass.reflectionTexture = hdrTexture;
        glass.refractionTexture = hdrTexture;
        glass.directIntensity = 1.0;
        glass.environmentIntensity = 0.1;
        glass.cameraExposure = 0.66;
        glass.cameraContrast = 1.66;
        glass.microSurface = 1;
        glass.reflectivityColor = new BABYLON.Color3( 1.0, 1.0, 1.0 );
        glass.albedoColor = new BABYLON.Color3( 0.95, 0.95, 0.95 );
        sphereGlass.material = glass;
        sphereGlass.scaling = new Vector3( 0.025, 0.025, 0.025 );


        // gltf Model
        const loader = SceneLoader.Append( "/assets/model/robot/", "scene.gltf",
            this._scene, ( scene ) => {

                console.log( scene );
                scene.createDefaultCamera( true, true, true );

                let meshs = scene.meshes;
                console.log( meshs );

                meshs.map( x => {

                    x.position.y = 0.5

                } );


            } );


    }

    doRender(): void {
        // render Loop
        this._engine.runRenderLoop( () => {
            // box rotation
            // const forceRotation: Vector3 = new Vector3( 0.08, 0.001, 0.05 );
            // this._box.addRotation( forceRotation.x, forceRotation.y, forceRotation.z );

            this._scene.render();
        } );

        // canvas/widow resize
        window.addEventListener( "resize", () => {
            this._engine.resize();
        } );
    }
}
