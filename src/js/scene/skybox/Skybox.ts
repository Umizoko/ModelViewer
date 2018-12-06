import {
    SkyMaterial,
    Mesh,
    Scene
} from "babylonjs";

export default class Skybox {

    mesh: Mesh;

    constructor( scene: Scene ) {
        const skyMaterial = new SkyMaterial( "skyMaterial", scene );
        skyMaterial.backFaceCulling = false;
        const skybox = Mesh.CreateBox( "skyBox", 1000.0, scene );
        skybox.material = skyMaterial;
        skyMaterial.turbidity = 5;
        skyMaterial.luminance = 0.5;
        skyMaterial.rayleigh = 1;
        this.mesh = skybox;
    }

}
