export default async function uploadImage(file:File) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'articlify')
    const data = await fetch('https://api.cloudinary.com/v1_1/basedest/image/upload/', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    if (data.error) {
        return [data.error, null]
    }
    return [null, data]
}