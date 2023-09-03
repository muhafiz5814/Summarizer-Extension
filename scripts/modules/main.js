import { summarizeText } from "../summarizer.js"
import { extractContent } from "../extract.js"


const summarizeUrlEl = document.getElementById("summarize-url")
const summarizeInBulletsUrlEl = document.getElementById("summarize-in-bullets-url")
const temporaryMessageUrlEl = document.getElementById("temporary-message-url")
const inputEl = document.getElementById("input-el")
const summarizeManualEl = document.getElementById("summarize-manual")
const summarizeInBulletsManualEl = document.getElementById("summarize-in-bullets-manual")
const temporaryMessageManualEl = document.getElementById("temporary-message-manual")
const modalBodyEl = document.getElementById("modal-body")
const openModalMessageEl = document.getElementById("open-modal-message")


function showTemporaryMessage1() {
    temporaryMessageUrlEl.innerHTML = `
                                        <p class="message">
                                            Getting page content to summarize.
                                        </p>
                                        <p class="message">
                                            It can take upto 60sec, please wait while we process
                                        </p>
                                    `
}

function showTemporaryMessage2(block) {
    if(block === "url"){
        temporaryMessageUrlEl.innerHTML = `
                                            <p class="message">
                                                Summarizing page content.
                                            </p>
                                            <p class="message">
                                                It can take upto 60sec, please wait while we process
                                            </p>
                                        `
    } else {
        temporaryMessageManualEl.innerHTML = `
                                            <p class="message">
                                                Summarizing text content.
                                            </p>
                                            <p class="message">
                                                It can take upto 60sec, please wait while we process
                                            </p>
                                        `
    }    
}

function showFailureMessage(block, message) {
    if(block === "url"){
        temporaryMessageUrlEl.innerHTML = `<p class="warning">${message}</p>`
    } else {
        temporaryMessageManualEl.innerHTML = `<p class="warning">${message}</p>`
    }
}


function renderOutput(data1) {

    openModalMessageEl.textContent = "Summary is ready, click below to open."
    const dataArray = data1.split("- ")
  
    modalBodyEl.innerHTML = ``

    for(let i=0; i<dataArray.length; i++){
        if(dataArray[i]){
            modalBodyEl.innerHTML += `
                                        <p>- ${dataArray[i]}</p>
                                        <hr>
                                    `
        }
    }
}

function generatePrompt(type, text){
    if(type === "bullet")
        return `Please provide some of the major points of the following text in form of bullet points and every point should have maximum 12 words with a full stop(.) at the end of sentence: ${text}`
    else
        return `Please summarize the following text: ${text}`
}

function getFailureMessage(process){
    if(process === "scraping"){
        return "Something happened, Unable to get page data.\n  Try manual summarization if error repeates."
    }
    return "Something happened, Unable to Summarize data.\n     Try again."
}


function getSummaryUrl(promptType) {

    openModalMessageEl.textContent = ""
    const block = "url"
    try{
        // Get url of the page
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            const tab = tabs[0].url
            
            showTemporaryMessage1()
            extractContent(tab).then(data => {
                let content = JSON.stringify(data.main)

                
                if(content === `"Unprocessed"`) {
                   
                    showFailureMessage(block, getFailureMessage("scraping"))
                } else {
                    showTemporaryMessage2(block)
                    const prompt = generatePrompt(promptType, content)
                    summarizeText(prompt).then(mainContent => {

                        if(mainContent === "Unprocessed"){
                            showFailureMessage(block, getFailureMessage("summarizing"))
                        } else {
                            temporaryMessageUrlEl.innerHTML = ""
                            renderOutput(mainContent)
                        }
                        
                    })
                }
            })
        })
    } catch(err){
        console.error(err)
        const message = "Unable to load url"
        showFailureMessage(block, message)
    }
}

function getSummaryManual(promptType){

    openModalMessageEl.textContent = ""
    const block = "manual"
    const paragraph = inputEl.value

    if(paragraph){

        showTemporaryMessage2(block)
        const prompt = generatePrompt(promptType, paragraph)

        summarizeText(prompt).then(mainContent => {

            if(mainContent === "Unprocessed"){
                showFailureMessage(block, getFailureMessage("summarizing"))
            } else {
                temporaryMessageManualEl.innerHTML = ""
                renderOutput(mainContent)
            }
        })
    } else {
        const message = "Please provide text."
        showFailureMessage(block, message)
    }
}


summarizeUrlEl.addEventListener("click", function() {
    getSummaryUrl("normal")
})

summarizeInBulletsUrlEl.addEventListener("click", function() {
    getSummaryUrl("bullet")
})

summarizeManualEl.addEventListener("click", function(){
    getSummaryManual("normal")
})

summarizeInBulletsManualEl.addEventListener("click", function() {
    getSummaryManual("bullet")
})