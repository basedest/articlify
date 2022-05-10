export default function
deleteArticle(slug: string, callback: Function) {
    let trigger = false
    fetch(`/api/articles/${slug}`, {
        method: 'DELETE',
    })
    .then(res => callback()) 
    .catch(console.error)
}