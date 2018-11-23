import {
    HDRCubeTexture,
    PBRMaterial,
    Scene
} from "babylonjs"

export default class HDRSkybox {

    hdrTexture: HDRCubeTexture;
    hdrSkybox: any;
    hdrSkyboxMaterial: PBRMaterial;

    /**
     *
     */
    constructor( scene: Scene, hdrTexture: HDRCubeTexture ) {


        // Scene
        const _scene: Scene = scene;


        // Environment Texture
        this.hdrTexture = hdrTexture;


        // Skybox
        this.hdrSkybox = BABYLON.Mesh.CreateBox( "hdrSkyBox", 1000.0, _scene );
        this.hdrSkyboxMaterial = new BABYLON.PBRMaterial( "hdrSkyBox", _scene );
        this.hdrSkyboxMaterial.backFaceCulling = false;
        this.hdrSkyboxMaterial.reflectionTexture = this.hdrTexture.clone();
        this.hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        this.hdrSkyboxMaterial.microSurface = 1.0;
        this.hdrSkyboxMaterial.cameraExposure = 0.66;
        this.hdrSkyboxMaterial.cameraContrast = 1.66;
        this.hdrSkyboxMaterial.disableLighting = true;
        this.hdrSkybox.material = this.hdrSkyboxMaterial;
        this.hdrSkybox.infiniteDistance = true;

    }


}
