export function formatDate(dateAndTimeString) {
    const date = `${dateAndTimeString.slice(8, 10)}-${dateAndTimeString.slice(5, 7)}-${dateAndTimeString.slice(0, 4)}`
    return date
}

export function formatTime(dateAndTimeString) {
    return dateAndTimeString.slice(11, 16)
}