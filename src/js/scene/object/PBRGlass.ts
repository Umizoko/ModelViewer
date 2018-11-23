import {
    Scene,
    HDRCubeTexture,
    Mesh,
    PBRMaterial,
    Color3,
    Vector3
} from "babylonjs";

export default class PBRGlass {

    public mesh: any;
    public material: PBRMaterial;


    /**
     *
     */
    constructor( scene: Scene, hdrTexture: HDRCubeTexture ) {

        const _scene: Scene = scene;
        const _hdrTexture: HDRCubeTexture = hdrTexture;


        this.mesh = Mesh.CreateSphere( 'sphereGlass', 48, 80.0, _scene );

        this.material = new PBRMaterial( 'glass', _scene );
        this.material.reflectionTexture = _hdrTexture;
        this.material.directIntensity = 1.0;
        this.material.environmentIntensity = 0.1;
        this.material.cameraExposure = 0.66;
        this.material.cameraContrast = 1.66;
        this.material.microSurface = 1;
        this.material.reflectivityColor = new Color3( 1.0, 1.0, 1.0 );
        this.material.albedoColor = new Color3( 0.95, 0.95, 0.95 );

        this.mesh.material = this.material;

        this.mesh.scaling = new Vector3( 0.025, 0.025, 0.025 );

    }

}
