import {
    DefaultRenderingPipeline,
    DepthOfFieldEffectBlurLevel,
    Scene,
    Camera
} from "babylonjs";

export default function pipeline ( scene: Scene, camera: Camera ) {


    const pipeline = new DefaultRenderingPipeline(
        'default',
        true,
        scene,
        [ camera ]
    );


    // Antialias
    pipeline.samples = 4;
    pipeline.fxaaEnabled = true;

    // Depth of field
    pipeline.depthOfFieldEnabled = true;
    pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.High;
    pipeline.depthOfField.focusDistance = 1000;
    pipeline.depthOfField.focalLength = 6;
    pipeline.depthOfField.fStop = 1.4;

    // Bloom
    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.25;
    pipeline.bloomWeight = 0.8;
    pipeline.bloomKernel = 32;
    pipeline.bloomScale = 0.5
}
