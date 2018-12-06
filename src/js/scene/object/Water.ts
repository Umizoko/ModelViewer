import {
    Mesh,
    WaterMaterial,
    Texture,
    Vector2,
    Color3,
    Scene
} from "babylonjs";

export default class Water {

    mesh: Mesh;
    constructor( scene: Scene ) {
        // water
        const ground = Mesh.CreateGround( "ground", 1024, 1024, 32, scene );
        const waterMaterial = new WaterMaterial( "water_material", scene );
        waterMaterial.bumpTexture = new Texture(
            "assets/texture/bump.png",
            scene
        );
        ground.material = waterMaterial;

        // water カスタム
        waterMaterial.windForce = 20;
        waterMaterial.waveHeight = 0.5;
        waterMaterial.bumpHeight = 0.5;
        waterMaterial.windDirection = new Vector2( 1.0, 1.0 );
        waterMaterial.waterColor = new Color3( 0.1, 0.1, 0.6 );
        waterMaterial.colorBlendFactor = 0.1;
        waterMaterial.waveLength = 0.1;
        this.mesh = ground;
    }

    public addToRenderList( mesh: Mesh ) {
        const material = < WaterMaterial > this.mesh.material;
        material.addToRenderList( mesh );
    }
}
