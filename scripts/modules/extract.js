export async function extractContent(url){

    const apiKey = "LBcgt9KswqYk8lwRk2K9sHmseFto2Zsk"
    const pageUrl = encodeURIComponent(url)

    const rulesToExtract = `{"main": {"selector": ".ssrcss-11r1m41-RichTextComponentWrapper", "all": "1"}}`
    const extract_rules = encodeURIComponent(rulesToExtract)

    const requestUrl = `https://api.webscrapingapi.com/v1?api_key=${apiKey}&url=${pageUrl}&render_js=1&proxy_type=residential&wait_until=networkidle0&timeout=60000&extract_rules=${extract_rules}&country=us`

    async function makeAPpiRequest(urlToFetch) {

        try{
            const response = await fetch(urlToFetch)

            if(!response.ok){
                throw new Error(`HTTP Error! Status: ${(response).status}`)
            }
            const result = await response.json()
            console.log(result)
            return result

        } catch (error){
            console.error(error)
            const warning = {main: "Unprocessed"}
            return warning
        }
    }

    const pageContet = await makeAPpiRequest(requestUrl)

    return pageContet
}