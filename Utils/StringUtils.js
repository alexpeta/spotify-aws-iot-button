
function toBase64(toConvert)
{
    if(!toConvert)
    {
        return '';
    }
    return Buffer.from(toConvert).toString('base64')
}

module.exports = {
    toBase64 : toBase64
}