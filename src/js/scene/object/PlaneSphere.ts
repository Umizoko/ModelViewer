import {
    Mesh,
    Material,
    Scene,
    MeshBuilder,
    StandardMaterial,
    Color3
} from "babylonjs";

export default class PlaneSphere {

    mesh: Mesh;
    material: any;

    /**
     *
     */
    constructor( scene: Scene ) {

        // scene
        const _scene: Scene = scene;

        // create mesh
        this.mesh = MeshBuilder.CreateSphere(
            "sphere", {
                segments: 16,
                diameter: 2
            },
            _scene
        );

        // create material
        this.material = new StandardMaterial( "this.material", _scene );
        this.material.diffuseColor = new Color3( 0.8, 0.8, 0.8 );
        this.material.specularColor = new Color3( 0.5, 0.6, 0.7 );
        this.material.emissiveColor = new Color3( 0.2, 0.2, 0.2 );
        this.material.ambientColor = new Color3( 0.2, 0.9, 0.5 );

        this.mesh.material = this.material;
    }

}
