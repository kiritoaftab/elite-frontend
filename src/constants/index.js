const BASE_URL = "http://localhost:4000/api"

function formatDate(input) {
    const date = new Date(input);

    // Get month name
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getUTCMonth()];

    // Get day of the month
    const day = date.getUTCDate();

    // Get hours and minutes
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;

    // Construct the final formatted string
    return `${day} ${month}, ${hours}:${minutesFormatted} ${ampm}`;
}

export {BASE_URL, formatDate};