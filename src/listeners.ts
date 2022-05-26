import { VideoPlayerType, PlayerListeners } from './models'
import { getDisplayTime } from './utils'

export const eventListeners = (videoPlayer: VideoPlayerType): PlayerListeners => {
    return {
        play: (e: Event) => {
            e.preventDefault()
            videoPlayer.playerNode.play()

            const pauseBtn = videoPlayer.createPlayPauseBtn('pause')
            videoPlayer.swapPlayPauseBtn(pauseBtn)
            videoPlayer.status = 'playing'
        },
        pause: () => {
            videoPlayer.playerNode.pause()

            const playBtn = videoPlayer.createPlayPauseBtn('play')
            videoPlayer.swapPlayPauseBtn(playBtn)

            videoPlayer.status = 'paused'
        },
        stop: () => {
            videoPlayer.playerNode.pause()

            const playBtn = videoPlayer.createPlayPauseBtn('play')
            videoPlayer.swapPlayPauseBtn(playBtn)
            
            videoPlayer.playerNode.currentTime = 0
            videoPlayer.status = 'stopped'
        },
        seek: (e) => {
            const target = e.target as HTMLInputElement
            videoPlayer.playerNode.currentTime = parseInt(target.value)
        },
        toggleRepeat: () => {
            const rpBtn = document.getElementById('rp-btn')

            if(!videoPlayer.looped) {
                videoPlayer.playerNode.loop = true
                videoPlayer.looped = true
                rpBtn.classList.add('repeated')
            } else {
                videoPlayer.playerNode.loop = false
                videoPlayer.looped = false
                rpBtn.classList.remove('repeated')
            }
        },
        toggleFullscreen: () => {
            const elem = videoPlayer.playerNode
            // const elem = document.getElementById('jh')

            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } 
            // else if (elem.webkitRequestFullscreen) { /* Safari */
            //     elem.webkitRequestFullscreen();
            // } else if (elem.msRequestFullscreen) { /* IE11 */
            //     elem.msRequestFullscreen();
            // }
        },
        fastForward: () => {
            const ct = videoPlayer.playerNode.currentTime
            videoPlayer.playerNode.currentTime = ct+2
        },
        fastBack: () => {
            const ct = videoPlayer.playerNode.currentTime
            videoPlayer.playerNode.currentTime = ct-2
        },
        onTimeUpdate: () => {
            const ct = videoPlayer.playerNode.currentTime
            const seeker = document.getElementById('seeker-input') as HTMLInputElement
            seeker.value = ct.toFixed().toString()

            const ctDisplay = document.getElementById('current-time')
            ctDisplay.textContent = getDisplayTime(ct)
        }
    }
}