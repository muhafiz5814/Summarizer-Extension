/** Import required functions from other modules. */
import { summarizeText } from "./summarizer.js"
import { extractContent } from "./extract.js"

/** Get all the required Elements from index.html to operate onto them. */
const summarizeUrlEl = document.getElementById("summarize-url")
const temporaryMessageUrlEl = document.getElementById("temporary-message-url")
const inputEl = document.getElementById("input-el")
const summarizeManualEl = document.getElementById("summarize-manual")
const temporaryMessageManualEl = document.getElementById("temporary-message-manual")
const summaryContentEl = document.getElementById("summary-content")
const majorPointsContentEl = document.getElementById("major-points-content")
const openSummaryMessageEl = document.getElementById("open-summary-message")
const openMajorPointsMessageEl = document.getElementById("open-major-points-message")
const summaryModalTitleEl = document.getElementById("summary-modal-title")

/** Define function to show temporary message while Getting page data in Direct section. */
function showTemporaryMessage1() {

/** Update temporary message to the following text. */
    temporaryMessageUrlEl.innerHTML = `
                                        <p class="message">
                                            Getting page content.
                                        </p>
                                        <p class="message">
                                            It can take upto 60sec, please wait while we process
                                        </p>
                                    `
}

/** Define function to show temporary message while Summarizing or Getting Major Points in any of the section. */
function showTemporaryMessage2(type, block) {
    if(block === "url"){
        if(type === "normal") {

            temporaryMessageUrlEl.innerHTML = `
                                                <p class="message">
                                                    Summarizing content.
                                                </p>
                                                <p class="message">
                                                    It can take upto 60sec, please wait while we process
                                                </p>
                                            `
        } else {
            temporaryMessageUrlEl.innerHTML = `
                                                <p class="message">
                                                    Generating Major Points.
                                                </p>
                                                <p class="message">
                                                    It can take upto 60sec, please wait while we process
                                                </p>
                                            `

        }
    } else {
        if(type === "normal") {

            temporaryMessageManualEl.innerHTML = `
                                                <p class="message">
                                                    Summarizing content.
                                                </p>
                                                <p class="message">
                                                    It can take upto 60sec, please wait while we process
                                                </p>
                                            `
        } else {
            temporaryMessageManualEl.innerHTML = `
                                                <p class="message">
                                                    Generating Major Points.
                                                </p>
                                                <p class="message">
                                                    It can take upto 60sec, please wait while we process
                                                </p>
                                            `

        }
    }    
}

/**
 * Define function to generate prompt accorting to request of user.
 * 
 * Either normal summary or bullets points.
 * 
 * It takes two string parameter, one is type of response we want and other is text that we want to process.
 */
function generatePrompt(type, text){
    if(type === "bullet")
        return `Please provide some of the major points of the following text in form of bullet points and every point should have maximum 12 words with a full stop(.) at the end of sentence: ${text}`
    else
        return `Please summarize the following text: ${text}`
}


/** Define function to get the Process failure message, according to at which stage, process failed. */
function getFailureMessage(process){
    if(process === "scraping"){
        return "Something happened, Unable to get page data.\n  Try manual summarization if error repeates."
    }
    return "Something happened, Unable to process data.\n     Try again."
}

/**
 * Define function to show the failure of the process at any stage. It takes temporary message element and updates it's text content.
 */
function showFailureMessage(block, message) {
    if(block === "url"){
        temporaryMessageUrlEl.innerHTML = `<p class="warning">${message}</p>`
    } else {
        temporaryMessageManualEl.innerHTML = `<p class="warning">${message}</p>`
    }
}

/** Defint function to get generated response and render out to DOM. */
function renderOutput(bodyEl, data) {

    /** Convert the String response to array of sentences. */
    const dataArray = data.split("- ")
  
    /** Before adding response text to the body, clear previous text present in body. */
    bodyEl.innerHTML = ``

    /** Loop through array to add every sentence to body. */
    for(let i=0; i<dataArray.length; i++){
        if(dataArray[i]){
            bodyEl.innerHTML += `
                                        <p>- ${dataArray[i]}</p>
                                        <hr>
                                    `
        }
    }
}

function renderSummary(type, data1) {
    
    if(type === "normal") {
        const bodyEl = summaryContentEl
        renderOutput(bodyEl, data1)
    
        /** Indicates users to click the show result button. */
        openSummaryMessageEl.textContent = "Summary is Ready."
    } else {
        const bodyEl = majorPointsContentEl
        renderOutput(bodyEl, data1)
        
        /** Indicates users to click the show result button. */
        openMajorPointsMessageEl.textContent = "Major Points are Ready."
    }
}


async function generateSummary(type, block, text){

    /** Call function to show temporary message of summarizing. */
    showTemporaryMessage2(type, block)

    /** Call function to generate the prompt according to user choice and store it in a variable. */
    const prompt = generatePrompt(type, text)

    const mainContent = await summarizeText(prompt)

    /** 
     * Check if we have got desired response, or the data summarization has failed.
     * 
     * If summarization has failed, show error message, else continue to next step. 
     */
    if(mainContent === "Unprocessed"){

        /** Call function to show failure message. */
        showFailureMessage(block, getFailureMessage("summarizing"))

    } else {

        /** Remove the temporary message as we have got the response and process has completed successfully. */
        temporaryMessageManualEl.innerHTML = ""

        /** Call function to Update tht DOM and show output to user. */
        renderSummary(type, mainContent)
    }
}

/**
 * Define function to generate the result when user choses direct method. It takes one string parameter of promptType according the user request.
 */
function getSummaryUrl() {

    /** Remove message, indicating to click the show result button, as we are now in new process. */
    openSummaryMessageEl.textContent = ""
    openMajorPointsMessageEl.textContent = ""

    const block = "url"

    /** try block throws error if not able to get the url of the page. */
    try{
        /** Get url of the page. */
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            const tab = tabs[0].url
            
            /** Call function to show temporary message of getting page data. */
            showTemporaryMessage1()

            /** Call function to extract data from page, using url. */
            extractContent(tab).then(data => {

                /** Convert the array response in string and store in a variable. */
                let content = JSON.stringify(data.main)

                /**
                 * Check if we have got desired response or the data extraction has failed.
                 * 
                 * If extraction failed, show error message, else continue to next step.
                 */
                if(content === `"Unprocessed"`) {

                    /** Call function to show failure message. */
                    showFailureMessage(block, getFailureMessage("scraping"))

                } else {

                    generateSummary("normal", block, content)
                    generateSummary("bullet", block, content)
                    
                }
            })
        })
    } catch(err){
        /** In case if url loading fails, catch block executes and process has failed. */
        console.error(err)
        const message = "Unable to load url"
        showFailureMessage(block, message)
    }
}

/**
 * Define function to generate the result when user choses direct method. It takes one string parameter of         promptType according the user request. 
 */
async function getSummaryManual(){

    /** Remove message, indicating to click the show result button, as we are now in new process. */
    openSummaryMessageEl.textContent = ""
    openMajorPointsMessageEl.textContent = ""

    const block = "manual"

    /** Get the User input from input element and store it in a variable. */
    const paragraph = inputEl.value

    /**
     * Check if input is provided or not.
     * 
     * If no input is provided, terminate the process here and indicate process failure. Otherwise continue processing. 
     */
    if(paragraph){

        /** Call function to generate summary or major points from the text using prompt parameter. */
        await generateSummary("normal", block, paragraph)
        await generateSummary("bullet", block, paragraph)

        
    } else {

        /** Create message to alert user to input text data and call function to show failure. */
        const message = "Please provide text."
        showFailureMessage(block, message)
    }
}

/** Add event listener to the summarize button of url section and call the getSummaryUrl() function. */
summarizeUrlEl.addEventListener("click", function() {
    getSummaryUrl()
})

/** Add event listener to the summarize button of manual section and call the getSummaryManual() function. */
summarizeManualEl.addEventListener("click", function(){
    getSummaryManual()
})
