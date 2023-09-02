export async function summarizeText(promptText) {

    // OpenAI API key
    const apiKey = 'ENTER-YOUR-API-KEY'

    // The prompt we want to provide to the model
    const prompt = promptText;

    // Define the API endpoint
    const url = 'https://api.openai.com/v1/chat/completions'

    // Define the request payload
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

    // Define headers for the request
    const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
    };

    // Define the async function to make the API request
    async function makeApiRequest() {
    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
        });

        if (!response.ok) {
        throw new Error(`Request failed with error: ${response}`)
        }

        const responseData = await response.json()
        const message = responseData.choices[0].message.content
        console.log(message);
        return message
    } catch (err) {
        console.error(err)
        return "Something happened, Unable to generate Summary."
    }
    }

    // Call the async function to make the API request
    const result = await makeApiRequest()
    // console.log(result)
    return result

}