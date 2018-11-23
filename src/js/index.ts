import Game from './scene/Game'

window.addEventListener( 'DOMContentLoaded', () => {

    let game = new Game( 'renderCanvas' );

    game.createScene();

    game.doRender();

} );
