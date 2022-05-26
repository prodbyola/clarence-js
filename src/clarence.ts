import { VideoPlayerType, VideoPlayerOptions, PlayerListeners } from "./models";
import { eventListeners } from './listeners'
import { getDisplayTime } from './utils';

class ClarencePlayer implements VideoPlayerType {
    playerNode: HTMLVideoElement;
    width: string;
    height: string;
    duration: number = 0;
    currentTime: number = 0;
    playerWrapper?: HTMLDivElement;
    leftSectionID?: string = 'player-left-section';
    rightSectionID?: string = 'player-right-section';
    centerSectionID?: string = 'player-center-section';
    shrinked: boolean = false;
    looped: boolean = false;
    listeners?: PlayerListeners;
    status?: "playing" | "paused" | "stopped" = 'stopped';

    constructor(options: VideoPlayerOptions) {
        const node = document.getElementById(options.nodeID) as HTMLVideoElement

        if(node){
            this.playerNode = node
        } else {
            new Error("The provided video element does not exist!")
        }

        this.width = options.width
        this.height = options.height ? options.height : 'auto'
        this.listeners = eventListeners(this)
    }

    /**
     * Mounts the video player
     */
    async mount() {
        await this.buildComponents()
        this.observeSize()
        const setter = setInterval(() => {
            const ready = this.playerNode.readyState
            if(ready > 0) {
                this.duration = this.playerNode.duration
                const seeker = document.getElementById('seeker-input')
                seeker.setAttribute('max', this.duration.toFixed().toString())

                const timeDisplay = document.getElementById('total-duration')
                timeDisplay.textContent = getDisplayTime(this.duration)

                clearInterval(setter)
            }
        }, 200)

        this.playerNode.addEventListener('timeupdate', this.listeners.onTimeUpdate)
        this.playerNode.addEventListener('ended', () => {
            if(!this.looped) {
                this.listeners.stop()
            }
        })
    }

    /**
     * Build player's components including video wrapper and controls.
     */
    async buildComponents () {
        const playerWrapper = document.createElement('div')
        playerWrapper.classList.add('bcp-wrapper')

        const playerNodeClone = this.playerNode.cloneNode(true)  as HTMLVideoElement

        playerWrapper.style.width = this.width
        playerWrapper.style.height = this.height
        // playerWrapper.addEventListener('click', e => e.preventDefault())

        playerWrapper.appendChild(playerNodeClone)

        this.playerNode.replaceWith(playerWrapper)
        this.playerNode = playerNodeClone
        this.playerWrapper = playerWrapper 

        const controls = this.buildControls()
        playerWrapper.appendChild(controls)

    }

    buildControls() {
        const controls = document.createElement('div')
        controls.classList.add('bcp-controls')

        // add seeker
        const seeker = this.createSeeker()
        controls.appendChild(seeker)

        // control box
        const ctrlBox = this.createVideoCtrlBox()
        controls.appendChild(ctrlBox)

        return controls
    }

    /**
     * Creates and returns the video seeker UI.
     * @returns 
     */
    createSeeker() {
        const seekerDiv = document.createElement('div')
        seekerDiv.classList.add('seeker-container')

        const seekerInput = document.createElement('input')
        seekerInput.classList.add('seeker-slider')
        seekerInput.id = 'seeker-input'
        seekerInput.setAttribute('type', 'range')
        seekerInput.setAttribute('min', '0')
        seekerInput.value = '0'
        seekerInput.addEventListener('input', this.listeners.seek)

        seekerDiv.appendChild(seekerInput)

        return seekerDiv
    }

    createVideoCtrlBox(){
        const videoCtrlBox = document.createElement('div')
        videoCtrlBox.classList.add('control-buttons-container')

        // creat volume control at left
        const volumeCtrl = this.createVolumeCtrl()

        // playback control at right
        const pbControl = this.createPlaybackCtrl()

        // other controls
        const otherCtrl = this.createOtherButtons()

        videoCtrlBox.appendChild(volumeCtrl)
        videoCtrlBox.appendChild(pbControl)
        videoCtrlBox.appendChild(otherCtrl)

        return videoCtrlBox
    }
    
    /**
     * Creates the volume control ui
     * @returns 
     */
    createVolumeCtrl(){
        // left section of the box
        const leftSection = document.createElement('div')
        leftSection.classList.add('cbc-left-section')
        leftSection.id = this.leftSectionID

        // volume ctrl container
        const speakerIcon = document.createElement('div')
        speakerIcon.classList.add('speaker-icon', 'player-icon')

        // volume icon
        const vIcon = document.createElement('i')
        vIcon.classList.add('fa-solid', 'fa-volume-high')
        speakerIcon.appendChild(vIcon)

        // volume slider
        const vSlider = document.createElement('input')
        vSlider.setAttribute('type', 'range')
        vSlider.classList.add('volume-ctrl-slider')

        leftSection.appendChild(speakerIcon)
        leftSection.appendChild(vSlider)
        return leftSection
    }

    /**
     * Creates playback control buttons at the center section
     * @returns 
     */
    createPlaybackCtrl(){
        const centerSection = document.createElement('div')
        centerSection.classList.add('cbc-center-section')
        centerSection.id = this.centerSectionID

        // current time
        const currentTime = document.createElement('p')
        currentTime.classList.add('time-display')
        currentTime.id = 'current-time'
        currentTime.textContent = '00:00'

        // fastBack icon and button
        const fbIcon = this.createIcon()
        fbIcon.classList.add('fa', 'fa-backward', 'player-icon')
        const fbBtn = this.createBtn()
        fbBtn.classList.add('fb-btn')
        fbBtn.appendChild(fbIcon)
        fbBtn.addEventListener('click', this.listeners.fastBack)

        // play icon and button
       const playBtn = this.createPlayPauseBtn('play')
        // this.btns.play = playBtn

        // fastBack icon and button
        const ffIcon = this.createIcon()
        ffIcon.classList.add('fa', 'fa-forward', 'player-icon')
        const ffBtn = this.createBtn()
        ffBtn.classList.add('ff-btn')
        ffBtn.appendChild(ffIcon)
        ffBtn.addEventListener('click', this.listeners.fastForward)

        // total duration
        const totalTime = currentTime.cloneNode(true) as HTMLParagraphElement
        totalTime.id = 'total-duration'

        centerSection.appendChild(currentTime)
        centerSection.appendChild(fbBtn)
        centerSection.appendChild(playBtn)
        centerSection.appendChild(ffBtn)
        centerSection.appendChild(totalTime)

        return centerSection
    }

    /**
     * create other buttons at the left section
     * @returns 
     */
    createOtherButtons(){
        const rightSection = document.createElement('div')
        rightSection.classList.add('cbc-right-section')
        rightSection.id = this.rightSectionID

        // stop button
        const stopBtn = this.createBtn()
        stopBtn.classList.add('stop-btn')
        const stopIcon = this.createIcon()
        stopIcon.classList.add('fa-solid', 'fa-stop', 'player-icon')
        stopBtn.appendChild(stopIcon)
        stopBtn.addEventListener('click', this.listeners.stop)

        // repeat button
        const rpBtn = this.createBtn()
        rpBtn.classList.add('rp-btn')
        rpBtn.id = 'rp-btn'
        const rpIcon = this.createIcon()
        rpIcon.classList.add('fa-solid', 'fa-repeat')
        rpBtn.appendChild(rpIcon)
        rpBtn.addEventListener('click', this.listeners.toggleRepeat)

        // fullscreen button
        const fsBtn = this.createBtn()
        fsBtn.classList.add('fs-btn')
        const fsIcon = this.createIcon()
        fsIcon.classList.add('fa-solid', 'fa-expand', 'player-icon')
        fsBtn.appendChild(fsIcon)
        fsBtn.addEventListener('click', this.listeners.toggleFullscreen)

        rightSection.appendChild(stopBtn)
        rightSection.appendChild(rpBtn)
        rightSection.appendChild(fsBtn)

        return rightSection
    }

    createBtn() {
        const btnDiv = document.createElement('div')
        btnDiv.classList.add('pb-btn')

        return btnDiv
    }

    createIcon() {
        const icon = document.createElement('i')
        return icon
    }

    createPlayPauseBtn(buttonType:'play' | 'pause') {
        const playIcon = this.createIcon()
        playIcon.classList.add('fa-solid', `fa-${buttonType}`, 'player-icon')

        const playBtn = this.createBtn()
        playBtn.id = 'play-pause-btn'
        playBtn.classList.add(`${buttonType}-btn`)
        playBtn.appendChild(playIcon)

        const listener = buttonType === 'play' ? this.listeners.play : this.listeners.pause
        
        playBtn.addEventListener('click', listener)

        return playBtn
    }

    swapPlayPauseBtn(newButton: HTMLDivElement){
        const currentBtn = document.getElementById('play-pause-btn')
        currentBtn.replaceWith(newButton)
    }

    /**
     * Observer player wrapper's size.
     * 
     * If the size is too small (below 520px), hides left and right section and resize middle section of the controller
     */
    observeSize(){
        const observer = new ResizeObserver((entries) => {
            const leftSection = document.getElementById(this.leftSectionID)
            const rightSection = document.getElementById(this.rightSectionID)
            const centerSection = document.getElementById(this.centerSectionID)
            const width = entries[0].contentRect.width
            if(width < 520) {
                this.hide(leftSection)
                this.hide(rightSection)
                centerSection.style.width = '100%'
                this.shrinked = true

            } else {
                if(this.shrinked) {
                    centerSection.style.width = '50%'
                    this.show(leftSection)
                    this.show(rightSection)
                }
            }
        })
        observer.observe(this.playerWrapper)
    }

    hide(node: HTMLElement){
        node.classList.add('hide')
    }

    show(node: HTMLElement){
        node.classList.remove('hide')
    }
}

export default ClarencePlayer