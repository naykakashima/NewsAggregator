export function createNewsCard(article) {
    const card = document.createElement("div");
    card.className = "bg-white rounded-2xl shadow-md p-4";

    // Standardize properties across APIs
    const title = article.title || article.webTitle || "No title available";
    const description = article.description || article.abstract || "No description available";
    const image = getImageUrl(article); // Handle image logic separately
    const url = article.url || article.webUrl || "#";
    const source = (article.source && article.source.name) || article.sectionName || article.source_id || "Unknown Source";
    const date = new Date(article.publishedAt).toUTCString() || new Date(article.webPublicationDate).toUTCString() || new Date(article.created_date).toUTCString() || "No Date Available";

    card.innerHTML = `
        <div class="card shadow-sm">
            <img 
                src="${image}" 
                class="w-full h-48 object-cover rounded-t-2xl" 
                alt="${title}"
                onerror="this.onerror=null;this.src='./assets/dummycard.png';"
            >
            <div class="card-body">
                <h5 class="card-title font-bold text-lg">${title}</h5>
                <p class="card-text text-gray-600">${description}</p>
                <p><small class="text-muted">${source}</small></p>
                <a class="text-blue-500" href="${url}" target="_blank" class="btn btn-primary"> Read More </a>
                <br>
                <a class="text-gray-400" class="btn btn-primary"> ${date} </a>
            </div>
        </div>
    `;
    return card;
}

function getImageUrl(article) {
    if (article.urlToImage) return article.urlToImage;            // NewsAPI  
    if (article.image_url) return article.image_url;              // NewsAPI alternate  
    if (article.fields?.thumbnail) return article.fields.thumbnail; // Guardian API  
    if (article.multimedia && article.multimedia.length > 0) {
        return article.multimedia[0].url;                        // NYT API  
    }
    return "./assets/dummycard.png";                             // Fallback image  
}