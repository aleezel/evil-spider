import { Howl, Howler } from 'howler';

export class SongManager {
    constructor(_filename) {
        const filename = _filename

        this.sound = new Howl({
            src: [this.filename],
            volume: 0.2,
            loop: true,
            onloaderror(id, err) {
                console.warn('failed to load sound file:', { id, err })
            }
        });
    }

    play() {
        // // console.log("dfgdfgdf")
        this.sound.play();
    }

}