import {
    Engine,
    Scene,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder
} from "babylonjs";

export default class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: FreeCamera;
    private _light: HemisphericLight;

    private _sphere: any;

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

        // Camera
        this._camera = new FreeCamera( 'camera', new Vector3( 0, 5, -10 ), this._scene );

        this._camera.setTarget( Vector3.Zero() );

        this._camera.attachControl( this._canvas, false );

        // Light
        this._light = new HemisphericLight( 'light', new Vector3( 0, 1, 0 ), this._scene );

        // Mesh
        this._sphere = MeshBuilder.CreateSphere( 'sphere', {
            segments: 16,
            diameter: 2
        }, this._scene );

        this._sphere.position.y = 1;

        let ground = MeshBuilder.CreateGround( 'ground', {
            width: 6,
            height: 6,
            subdivisions: 2
        }, this._scene );


    }

    doRender(): void {

        // render Loop
        this._engine.runRenderLoop( () => {

            this._sphere.position.y = Math.sin( Date.now() );

            this._scene.render();

        } );

        // canvas/widow resize
        window.addEventListener( 'resize', () => {

            this._engine.resize();

        } );
    }
}
