export const formattedDuration = (duration: number) => {
    let formatDuration;
    const rounded = Math.floor(duration)
    const biggerThanMinute = Math.floor(rounded / 60)
    if (biggerThanMinute >= 1) {
        const minutes = 60 * biggerThanMinute
        const seconds = rounded - minutes
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds
        formatDuration = `${biggerThanMinute}:${formattedSeconds}`
    } else {
        const formattedSeconds = rounded < 10 ? `0${rounded}` : rounded
        formatDuration = `0:${formattedSeconds}`
    }

    return formatDuration
}
