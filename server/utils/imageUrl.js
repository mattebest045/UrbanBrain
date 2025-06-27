import dotenv from 'dotenv';
dotenv.config();

function generateImageUrl(event) {
    if (!event || typeof event !== 'object') return event;

    const baseUrl = process.env.EVENTS_IMAGE_BASE_URL || 'http://localhost:3001/uploads/events/';
    event.dataValues.imageUrl = event.filename
        ? `${baseUrl}${event.filename}`
        : `${baseUrl}default.png`;

    return event;
}

function generateImageUrlList(events) {
    if (!Array.isArray(events)) return [];

    return events.map(event => generateImageUrl(event));
}

module.exports = {
    generateImageUrl,
    generateImageUrlList
};
