import {
    Engine,
    Scene,
    Vector3,
    HemisphericLight,
    ArcRotateCamera,
    HDRCubeTexture,
    SceneLoader,
} from "babylonjs";

// Debug Layer
import "babylonjs-inspector";

// Model Export
import "babylonjs-serializers";

// Model Loaders
import "babylonjs-loaders";

// extentions
// materilal
import "babylonjs-materials";

// post-process
import "babylonjs-post-process";

import HDRSkybox from "./skybox/HDRSkybox";
import PBRGlass from "./object/PBRGlass";

import pipeline from './render/Pipeline';
import Skybox from "./skybox/Skybox";
import Water from "./object/Water";

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
        this._light.intensity = 1.5;

        // Environment Texture
        // const hdrTexture = new HDRCubeTexture(
        //     "assets/skybox/HDR_111_Parking_Lot_2_Ref.hdr",
        //     this._scene,
        //     512
        // );

        //sky
        const skybox = new Skybox( this._scene );

        // Reflection probe
        var rp = new BABYLON.ReflectionProbe( "ref", 512, this._scene );
        rp.renderList.push( skybox.mesh );

        // PBRMaterial
        var pbr = new BABYLON.PBRMaterial( "pbr", this._scene );
        pbr.reflectionTexture = rp.cubeTexture;

        // water
        const water = new Water( this._scene );
        water.addToRenderList( skybox.mesh );


        // GLTF Model
        const helmet = {
            FilePath: "assets/model/damagedHelmet/",
            FileName: "damagedHelmet.gltf",
            ID: "node_damagedHelmet_-6498"
        };

        const robot = {
            FilePath: "assets/model/robot/",
            FileName: "scene.gltf",
            ID: "defaultMaterial"
        };

        const soldier = {
            FilePath: "assets/model/Soldier/",
            FileName: "Soldier.gltf"
        };

        const miku = {
            FilePath: "assets/model/append/",
            FileName: "miku.gltf"
        };

        const ai = {
            FilePath: "assets/model/KizunaAI/",
            FileName: "ai.gltf"
        };

        // GLTF Loader
        const loader = SceneLoader.Append(
            ai.FilePath,
            ai.FileName,
            this._scene,
            objects => {

                let meshes: any = objects.meshes;

                meshes.map( mesh => {
                    if ( mesh.id === "__root__" ) {
                        mesh.scaling = new Vector3( 5, 5, 5 );
                        mesh.position.y = 0;
                    }

                    if ( mesh.id === "node_damagedHelmet_-6498" ) {
                        // mesh.material.reflectionTexture = hdrTexture;
                    }

                    if ( mesh.id === "defaultMaterial" ) {
                        // mesh.material.reflectionTexture = hdrTexture;
                    }

                    if ( mesh.id === "Paladin_J_Nordstrom" ) {

                        // mesh.material.reflectionTexture = hdrTexture;
                        mesh.material.reflectionTexture = pbr.reflectionTexture;

                        water.addToRenderList( mesh );
                    }

                    const a = mesh.id.match( /^Tda式ミク・アペンド_/ );
                    if ( a ) {
                        console.log( a );
                        if ( a.input === "Tda式ミク・アペンド_arm" ) return;
                        if ( a.input === "Tda式ミク・アペンド_mesh" ) return;
                        if ( a.input === "Tda式ミク・アペンド_arm_操作中心" ) return;

                        mesh.material.reflectionTexture = pbr.reflectionTexture;

                        water.addToRenderList( mesh );
                    }

                    // if ( mesh.id === /^Tda/ ) {

                    //     // mirror.material.reflectionTexture.renderList.push( mesh );

                    //     // mesh.material.reflectionTexture = hdrTexture;

                    //     mesh.material.reflectionTexture = pbr.reflectionTexture

                    //     waterMaterial.addToRenderList( mesh );

                    // }

                    // Helmet追加
                } );
            }
        );


        // renderPipelineの設定
        pipeline( this._scene, this._camera );

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
