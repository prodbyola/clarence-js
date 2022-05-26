export interface VideoPlayerType {
    status?: 'playing' | 'paused' | 'stopped',
    playerNode: HTMLVideoElement,
    playerWrapper?: HTMLDivElement,
    width: string,
    height: string,
    leftSectionID?: string,
    rightSectionID?: string,
    centerSectionID?: string,
    duration: number,
    currentTime: number,
    looped: boolean
    listeners?: PlayerListeners,
    createPlayPauseBtn(buttonType: 'play' | 'pause'): HTMLDivElement
    swapPlayPauseBtn(newButton: HTMLDivElement): void,
}

export type VideoPlayerOptions = {
    nodeID: string,
    width: string,
    height?: string,
}

type ListenerType = (e?: Event) => void;
export type PlayerListeners = {
    play?: ListenerType;
    pause?: ListenerType;
    stop?: ListenerType;
    seek?:ListenerType;
    fastForward?: ListenerType;
    fastBack?: ListenerType;
    toggleRepeat?: ListenerType;
    toggleFullscreen?: ListenerType,
    onTimeUpdate: ListenerType;
}