/**
 * Define function to get the data from the page, whose url is provided in parameter.
 * 
 * Extract the function to use it in main.js.
 */
export async function extractContent(url){

    /** Store unique API Key in variable. */
    const apiKey = "API-KEY"

    /** Encode the provided url and store in a variable. */
    const pageUrl = encodeURIComponent(url)

    /**
     * Define the rules to extract the desired html elements or data from page.
     * 
     * Encode Extract Rules and store in a variable.
     */
    const rulesToExtract = `{"main": {"selector": ".ssrcss-11r1m41-RichTextComponentWrapper", "all": "1"}}`
    const extract_rules = encodeURIComponent(rulesToExtract)

    /**
     * Replace all the required text with variables in final url and store it in a variable.
     * 
     * This is the url which will be passed to API as API Request.
     */
    const requestUrl = `https://api.webscrapingapi.com/v1?api_key=${apiKey}&url=${pageUrl}&render_js=1&proxy_type=residential&wait_until=networkidle0&timeout=60000&extract_rules=${extract_rules}&country=us`

    /**
     * Define function to make the HTTP API Request using fetch and async-await.
     * 
     * This function returns a promise containing an object with desired html content.
     */
    async function makeAPpiRequest(urlToFetch) {

        try{

            /** Send HTTP Request to API using fetch. */
            const response = await fetch(urlToFetch)

            /** Check if we got right response or not. */
            if(!response.ok){
                throw new Error(`HTTP Error! Status: ${(response).status}`)
            }

            /** Store the response in a variable. */
            const result = await response.json()
            console.log(result)

            /** Return Result. */
            return result

        } catch (error){
            console.error(error)

            /** In case if request fails, create an object with message unprocessed and return. */
            const warning = {main: "Unprocessed"}
            return warning
        }
    }

    /** Call the makeAPIRequest() function and store its result in a variable and return. */
    const pageContet = await makeAPpiRequest(requestUrl)

    return pageContet
}