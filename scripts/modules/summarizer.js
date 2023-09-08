/**
 * Define function to summarize the data, we got either from input element or from extractor.
 * 
 * Extract the function to use it in main.js.
 */
export async function summarizeText(promptText) {

    /** OpenAI API key. */
    const apiKey = 'API-KEY'

    /** The prompt we want to provide to the model. */
    const prompt = promptText;

    /** Define the API endpoint. */
    const url = 'https://api.openai.com/v1/chat/completions'

    /** Define the request payload.
     * 
     * Specify which modal to use, and also tell modal to behave like a summarizer.
     */
    const data = {
    model: 'gpt-3.5-turbo',
    messages: [
        {
        role: 'system',
        content: 'You are a helpful assistant that generates summaries of texts.'
        },
        {
        role: 'user',
        content: prompt
        }
    ],
    max_tokens: 450
    };

    /** Define headers for the request. */
    const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
    };

    /**
     * Define the async function to make the API request.
     * 
     * Define function to make the HTTP API Request using fetch and async-await.
     * 
     * This function returns a promise of json format.
     */
    async function makeApiRequest() {
    try {

        /** Send HTTP Request to API using fetch. */
        const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
        });

        /** Check if we got right response or not. */
        if (!response.ok) {
        throw new Error(`Request failed with error: ${response.status}`)
        }

        /** Store the response in a variable. */
        const responseData = await response.json()
        
        /** Get the desired text content from the Json response. */
        const message = responseData.choices[0].message.content
        console.log(message);

        /** Return message. */
        return message
    } catch (err) {
        console.error(err)

        /** In case if request fails, return an string with message unprocessed. */
        return "Unprocessed"
    }
    }

    /** Call the makeAPIRequest() function and store its result in a variable and return. */
    const result = await makeApiRequest()
    return result
}