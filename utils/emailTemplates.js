export const getEmailTemplate = (messageType, customMessage) => {
    switch (messageType) {
        case 'accepted':
            return `<h1>Congratulations!</h1><p>${customMessage}</p>`;
        case 'rejected':
            return `<h1>Application Update</h1><p>${customMessage}</p>`;
        case 'interview':
            return `<h1>Interview Invitation</h1><p>${customMessage}</p>`;
        default:
            return `<p>${customMessage}</p>`;
    }
};