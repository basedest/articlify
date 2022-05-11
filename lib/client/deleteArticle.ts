//удаление статьи
export default function
deleteArticle(slug: string, callback: Function) {
    fetch(`/api/articles/${slug}`, {
        method: 'DELETE',
    })
    .then(_ => callback()) 
    .catch(console.error)
}