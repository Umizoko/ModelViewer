import {
    Engine,
    Scene,
    Vector3,
    HemisphericLight,
    ArcRotateCamera,
    HDRCubeTexture,
    SceneLoader,
    StandardMaterial,
    Mesh,
    MirrorTexture,
    Plane,
    Texture,
    WaterMaterial,
    Vector2,
    Color3,
    SkyMaterial,
    PostProcessRenderPipeline,
    BlackAndWhitePostProcess,
    PostProcessRenderEffect,
} from "babylonjs";

// Debug Layer
import "babylonjs-inspector"

// Model Export
import "babylonjs-serializers"

// Model Loaders
import "babylonjs-loaders"

// extentions 
// materilal
import 'babylonjs-materials'

// post-process
import 'babylonjs-post-process'

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


    private _hdrSkybox: HDRSkybox;
    private _PBRGlass: PBRGlass;

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
            50,
            Vector3.Zero(),
            this._scene
        );

        this._camera.wheelPrecision = 1;
        this._camera.attachControl( this._canvas, false );
        this._camera.useAutoRotationBehavior = true;
        this._camera.upperBetaLimit = Math.PI / 2;
        this._camera.lowerRadiusLimit = 10;
        this._camera.upperRadiusLimit = 100;

        // Light
        this._light = new HemisphericLight(
            "light",
            new Vector3( 0, 1, 0 ),
            this._scene
        );
        this._light.intensity = 0.5;


        // Environment Texture
        const hdrTexture = new HDRCubeTexture(
            "assets/skybox/HDR_111_Parking_Lot_2_Ref.hdr",
            this._scene,
            512
        );

        // HDR Skybox
        // this._hdrSkybox = new HDRSkybox(
        //     this._scene,
        //     hdrTexture
        // );

        // PBR Glass
        // this._PBRGlass = new PBRGlass(
        //     this._scene,
        //     hdrTexture
        // );

        // Ground: mirror
        // let mirror: any = Mesh.CreateBox(
        //     "Mirror",
        //     1.0,
        //     this._scene
        // );
        // mirror.scaling = new Vector3( 100.0, 0.01, 100.0 );
        // mirror.material = new StandardMaterial( 'mirror', this._scene );
        // mirror.material.reflectionTexture = new MirrorTexture(
        //     'mirror', {
        //         ratio: 1.0
        //     },
        //     this._scene,
        //     true
        // );
        // mirror.material.reflectionTexture.mirrorPlane = new Plane( 0, -1, 0, -2 );
        // mirror.material.reflectionTexture.renderList = [ this._hdrSkybox.hdrSkybox ];
        // mirror.material.reflectionTexture.level = 1.0;
        // mirror.material.reflectionTexture.adaptiveBlurKernel = 8;
        // mirror.position = new Vector3( 0, 0, 0 );


        //sky
        const skyMaterial = new SkyMaterial( 'skyMaterial', this._scene );
        skyMaterial.backFaceCulling = false;
        const skybox = Mesh.CreateBox( 'skyBox', 1000.0, this._scene );
        skybox.material = skyMaterial;
        skyMaterial.turbidity = 5;
        skyMaterial.luminance = 0.5;
        skyMaterial.rayleigh = 1;

        // Reflection probe
        var rp = new BABYLON.ReflectionProbe( 'ref', 512, this._scene );
        rp.renderList.push( skybox );

        // PBR
        var pbr = new BABYLON.PBRMaterial( 'pbr', this._scene );
        pbr.reflectionTexture = rp.cubeTexture;

        // water
        const ground = Mesh.CreateGround( 'ground', 1024, 1024, 32, this._scene );
        const waterMaterial = new WaterMaterial( 'water_material', this._scene );
        waterMaterial.bumpTexture = new Texture( 'assets/texture/bump.png', this._scene );
        ground.material = waterMaterial;
        // 反射するMeshを追加
        // waterMaterial.addToRenderList( this._hdrSkybox.hdrSkybox );
        waterMaterial.addToRenderList( skybox );
        // water カスタム
        waterMaterial.windForce = 20;
        waterMaterial.waveHeight = 0.5;
        waterMaterial.bumpHeight = 0.5;
        waterMaterial.windDirection = new Vector2( 1.0, 1.0 );
        waterMaterial.waterColor = new Color3( 0.1, 0.1, 0.6 );
        waterMaterial.colorBlendFactor = 0.1;
        waterMaterial.waveLength = 0.1;

        // GLTF Model
        const helmet = {
            FilePath: "assets/model/damagedHelmet/",
            FileName: 'damagedHelmet.gltf',
            ID: 'node_damagedHelmet_-6498'
        }

        const robot = {
            FilePath: 'assets/model/robot/',
            FileName: 'scene.gltf',
            ID: 'defaultMaterial'
        }

        const soldier = {
            FilePath: 'assets/model/Soldier/',
            FileName: 'Soldier.gltf',
        }

        const miku = {
            FilePath: 'assets/model/append/',
            FileName: 'miku.gltf'
        }

        // GLTF Loader
        const loader = SceneLoader.Append( soldier.FilePath, soldier.FileName,
            this._scene, ( objects ) => {

                // objects.createDefaultCamera( true, true, true );

                let meshes: any = objects.meshes;

                meshes.map( mesh => {

                    if ( mesh.id === '__root__' ) {

                        mesh.scaling = new Vector3( 10, 10, 10 );
                        mesh.position.y = 0;

                    }

                    if ( mesh.id === 'node_damagedHelmet_-6498' ) {

                        // mirror.material.reflectionTexture.renderList.push( mesh );

                        // mesh.material.reflectionTexture = hdrTexture;

                    }

                    if ( mesh.id === "defaultMaterial" ) {

                        // mirror.material.reflectionTexture.renderList.push( mesh );

                        // mesh.material.reflectionTexture = hdrTexture;

                    }

                    if ( mesh.id === "Paladin_J_Nordstrom" ) {

                        // mirror.material.reflectionTexture.renderList.push( mesh );

                        // mesh.material.reflectionTexture = hdrTexture;

                        mesh.material.reflectionTexture = pbr.reflectionTexture

                        waterMaterial.addToRenderList( mesh );


                    }

                    const a = mesh.id.match( /^Tda式ミク・アペンド_/ );
                    if ( a ) {
                        console.log( a );
                        if ( a.input === 'Tda式ミク・アペンド_arm' ) return;
                        if ( a.input === 'Tda式ミク・アペンド_mesh' ) return;
                        if ( a.input === 'Tda式ミク・アペンド_arm_操作中心' ) return;


                        mesh.material.reflectionTexture = pbr.reflectionTexture

                        waterMaterial.addToRenderList( mesh );
                    }

                    // if ( mesh.id === /^Tda/ ) {


                    //     // mirror.material.reflectionTexture.renderList.push( mesh );

                    //     // mesh.material.reflectionTexture = hdrTexture;

                    //     mesh.material.reflectionTexture = pbr.reflectionTexture

                    //     waterMaterial.addToRenderList( mesh );


                    // }

                    // Helmet追加

                } );


            } );

        // Post-Process
        const standardPipeline = new PostProcessRenderPipeline( this._engine, "standardPipeline" );

        const blackAndWhite = new BlackAndWhitePostProcess( "bw", 1.0, null, null, this._engine, false );

        var blackAndWhiteThenBlur = new PostProcessRenderEffect( this._engine, "blackAndWhiteThenBlur", function () {
            return [ blackAndWhite ]
        } );
        standardPipeline.addEffect( blackAndWhiteThenBlur );

        this._scene.postProcessRenderPipelineManager.addPipeline( standardPipeline );
        this._scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline( "standardPipeline", this._camera );
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
