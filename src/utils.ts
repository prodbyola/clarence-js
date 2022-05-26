/**
 * Converts seconds in time to readable hr:min:sec
 * @param {number} sec - The time in seconds
 */
 export const getDisplayTime = (sec:number) => {
    let fTime = "00:00"

    if (sec) {
        const config = {
            minimumIntegerDigits: 2,
            useGrouping: false
        }
        const hrs = ~~(sec / 3600).toLocaleString("en-US", config)
        const mins = ~~((sec % 3600) / 60).toLocaleString("en-US", config)
        const secs = (~~sec % 60).toLocaleString("en-US", config)

        if (hrs > 0) fTime = hrs + ":" + mins + ':' + secs
        else fTime = mins + ':' + secs
    }

    return fTime
}