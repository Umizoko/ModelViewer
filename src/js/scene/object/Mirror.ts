import {
    Mesh,
    Vector3,
    StandardMaterial,
    MirrorTexture,
    Plane,
    Scene
} from "babylonjs";

export default class Mirror {

    self: any;

    constructor( scene: Scene ) {
        // Ground: mirror
        let mirror: any = Mesh.CreateBox(
            "Mirror",
            1.0,
            scene
        );
        mirror.scaling = new Vector3( 100.0, 0.01, 100.0 );
        mirror.material = new StandardMaterial( 'mirror', scene );
        mirror.material.reflectionTexture = new MirrorTexture(
            'mirror', {
                ratio: 1.0
            },
            scene,
            true
        );
        mirror.material.reflectionTexture.mirrorPlane = new Plane( 0, -1, 0, -2 );
        mirror.material.reflectionTexture.level = 1.0;
        mirror.material.reflectionTexture.adaptiveBlurKernel = 8;
        mirror.position = new Vector3( 0, 0, 0 );

        this.self = mirror;
    }

    public addReflectionTextureRenderList( mesh: Mesh ): void {

        this.self.material.reflectionTexture.renderList.push( mesh );

    }
}
