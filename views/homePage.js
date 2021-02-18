module.exports = () => {
    return `
    <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Acme Country Club</title>
            </head>
            <body>
                <ul>
                    <li><a href="/api/facilities">facilities</a></li>
                    <li><a href="/api/bookings">bookings</a></li>
                    <li><a href="/api/members">members</a></li>
                </ul>
            </body>
        </html>
    `
}