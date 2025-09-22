
let audioInstance = null;

export function initAudio(src) {
    if (!audioInstance) {
        audioInstance = new Audio(src);
    }
    return audioInstance;
}

export function audio() {
    return audioInstance;
}
