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
    BackgroundMaterial
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


        // sphere
        // this._planeSphere = new PlaneSphere( this._scene );

        // SimpleLine
        // this._simpleLines = new SimpleLines( this._scene );


        // Environment Texture
        const hdrTexture = new HDRCubeTexture(
            "/assets/skybox/HDR_111_Parking_Lot_2_Ref.hdr",
            this._scene,
            512
        );

        // HDR Skybox
        this._hdrSkybox = new HDRSkybox(
            this._scene,
            hdrTexture
        );

        // PBR Glass
        this._PBRGlass = new PBRGlass(
            this._scene,
            hdrTexture
        );

        let gltfModel: any;

        // gltf Model
        const loader = SceneLoader.Append( "/assets/model/robot/", "scene.gltf",
            this._scene, ( scene ) => {

                scene.createDefaultCamera( true, true, true );

                let meshs = scene.meshes;


                meshs.map( x => {

                    if ( x.id === '__root__' ) {
                        x.scaling = new Vector3( 3, 3, 3 );

                        gltfModel = x;

                    }


                } );


            } );


        let mirror = Mesh.CreateBox(
            "mirror", 1.0,
            this._scene
        );
        mirror.scaling = new Vector3( 50, 0.01, 50 );
        mirror.receiveShadows = true;

        // var mirrorMaterial: any = new StandardMaterial( 'mirror', this._scene );
        // mirrorMaterial.reflectionTexture = new MirrorTexture( 'mirror', 512, this._scene, true );
        // mirrorMaterial.reflectionTexture.mirrorPlane = new Plane( 0.0, -1.0, 0.0, 0.0 );
        // // mirrorMaterial.reflectionTexture.renderList[this._PBRGlass.mesh, gltfModel];
        // mirrorMaterial.reflectionTexture.renderList.push( this._PBRGlass );
        // mirrorMaterial.reflectionTexture.level = 1.0;
        // mirrorMaterial.reflectionTexture.adaptiveBlurKernel = 32;
        // mirror.material = mirrorMaterial;

        // Create and tweak the background material.
        var backgroundMaterial = new BABYLON.BackgroundMaterial( "backgroundMaterial", this._scene );

        var mirrorMaterial = new BABYLON.MirrorTexture( "mirror", 512, this._scene );
        mirrorMaterial.mirrorPlane = new BABYLON.Plane( 0, -1, 0, -2 );
        mirrorMaterial.renderList.push( this._PBRGlass.mesh );
        // mirrorMaterial.renderList.push(gltfModel);

        backgroundMaterial.reflectionTexture = mirrorMaterial;

        mirror.material = backgroundMaterial;
        mirror.position = new Vector3( 0, -2, 0 );


        // Fog
        // TODO: FOG
        // this._scene.fogMode = Scene.FOGMODE_LINEAR;
        // this._scene.fogStart = 20.0;
        // this._scene.fogEnd = 50.0;


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
