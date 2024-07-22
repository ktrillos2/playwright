export const convertBase64ToFile = (imageBase64: any, fileName: string) => {
    const match = imageBase64.match(/data:(.*);base64,(.*)/);
    if (!match) {
        throw new Error(
            "No se pudo extraer el contenido y el tipo MIME de la cadena base64"
        );
    }
    const mimeType = match[1];
    const base64Data = match[2];

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: mimeType });

    const file = new File([blob], fileName, { type: mimeType });
    return file;
};
