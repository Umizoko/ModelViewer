import {
    Engine,
    Scene,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    ArcRotateCamera,
    HDRCubeTexture,
    SceneLoader,
    ReflectionProbe,
    Material,
    StandardMaterial,
    FresnelParameters,
    Mesh,
    MirrorTexture,
    Plane,
    BackgroundMaterial,
    Color3,
    CubeTexture,
    PBRMetallicRoughnessMaterial
} from "babylonjs";

// Debug Layer
import "babylonjs-inspector"

// Model Export
import "babylonjs-serializers"

// Model Loaders
import "babylonjs-loaders"

import HDRSkybox from './skybox/HDRSkybox'
import PBRGlass from './object/PBRGlass'
import PlaneSphere from './object/PlaneSphere'
import SimpleLines from './object/SimpleLines'

export default class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: ArcRotateCamera;
    private _light: HemisphericLight;

    private _sphere: any;
    private _box: any;

    private _hdrSkybox: HDRSkybox;
    private _PBRGlass: PBRGlass;
    private _planeSphere: PlaneSphere;
    private _simpleLines: SimpleLines;

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

        // Debug
        this._scene.debugLayer.show();

        // ArcRotationCamera
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
        this._light.intensity = 0.0;


        // sphere
        // this._planeSphere = new PlaneSphere( this._scene );

        // SimpleLine
        // this._simpleLines = new SimpleLines( this._scene );


        // Environment Texture
        const hdrTexture = new HDRCubeTexture(
            "/assets/skybox/HDR_111_Parking_Lot_2_Ref.hdr",
            this._scene,
            1024
        );

        // HDR Skybox
        this._hdrSkybox = new HDRSkybox(
            this._scene,
            hdrTexture
        );

        // PBR Glass
        // this._PBRGlass = new PBRGlass(
        //     this._scene,
        //     hdrTexture
        // );

        // Ground: mirror
        let mirror: any = Mesh.CreateBox(
            "Mirror",
            1.0,
            this._scene
        );
        mirror.scaling = new Vector3( 100.0, 0.01, 100.0 );
        mirror.material = new StandardMaterial( 'mirror', this._scene );
        mirror.material.reflectionTexture = new MirrorTexture(
            'mirror', {
                ratio: 1.0
            },
            this._scene,
            true
        );
        mirror.material.reflectionTexture.mirrorPlane = new Plane( 0, -1, 0, -2 );
        mirror.material.reflectionTexture.renderList = [ this._hdrSkybox.hdrSkybox ];
        mirror.material.reflectionTexture.level = 1.0;
        mirror.material.reflectionTexture.adaptiveBlurKernel = 8;
        mirror.position = new Vector3( 0, -2, 0 );


        // gltf Model
        const helmetFilePath = "/assets/model/damagedHelmet/";
        const helmetFileName = "damagedHelmet.gltf";
        const helmetID = "node_damagedHelmet_-6498";

        const loader = SceneLoader.Append( "/assets/model/robot/", "scene.gltf",
            this._scene, ( objects ) => {

                objects.createDefaultCamera( true, true, true );

                let meshes: any = objects.meshes;

                console.log( meshes );

                meshes.map( mesh => {

                    if ( mesh.id === '__root__' ) {

                        mesh.scaling = new Vector3( 10, 10, 10 );
                        mesh.position.y = 10;

                    }

                    if ( mesh.id === 'node_damagedHelmet_-6498' ) {

                        mirror.material.reflectionTexture.renderList.push( mesh );

                        mesh.material.reflectionTexture = hdrTexture;

                    }

                    if ( mesh.id === "defaultMaterial" ) {

                        mirror.material.reflectionTexture.renderList.push( mesh );

                        mesh.material.reflectionTexture = hdrTexture;

                    }

                } );


            } );


        // Fog
        // this._scene.fogMode = Scene.FOGMODE_LINEAR;
        // this._scene.fogMode = Scene.FOGMODE_EXP2;
        // this._scene.fogColor = new Color3( 0, 0, 0 );
        // this._scene.fogDensity = 0.005;
        // this._scene.fogStart = 0.0;
        // this._scene.fogEnd = 1000.0;


    }

    doRender(): void {

        // render Loop
        this._engine.runRenderLoop( () => {

            this._scene.render();

        } );

        // canvas/widow resize
        window.addEventListener( "resize", () => {

            this._engine.resize();

        } );

    }
}
