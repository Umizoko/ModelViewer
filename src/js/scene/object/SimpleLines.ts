import {
    Vector3,
    MeshBuilder,
    LinesMesh,
    Scene,
    Color3
} from "babylonjs";

export default class SimpleLines {

    // FIXME: Pointsの配列参照
    // points;
    lines: LinesMesh;

    /**
     *
     */
    constructor( scene: Scene ) {

        // const _scene = scene;

        // var point1 = new Vector3( -1, 0, 0 );
        // var point2 = new Vector3( 0, 1, 1 );
        // var point3 = new Vector3( 1, 1, 0 );

        // this.points.push( point1 );
        // this.points.push( point2 );
        // this.points.push( point3 );

        // this.lines = MeshBuilder.CreateLines( 'line', {

        //         points: this.points

        //     },
        //     _scene );


        // this.lines.position.x = 1;
        // this.lines.color = new Color3( 1, 0.7, 0.7 );

    }


}
