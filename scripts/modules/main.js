import { summarizeText } from "./summarizer.js"
import { extractContent } from "./extract.js"


const summarizeUrlEl = document.getElementById("summarize-url")
const summarizeInBulletsUrlEl = document.getElementById("summarize-in-bullets-url")
const temporaryMessageUrlEl = document.getElementById("temporary-message-url")
const inputEl = document.getElementById("input-el")
const summarizeManualEl = document.getElementById("summarize-manual")
const summarizeInBulletsManualEl = document.getElementById("summarize-in-bullets-manual")
const temporaryMessageManualEl = document.getElementById("temporary-message-manual")
const modalBodyEl = document.getElementById("modal-body")
const openModalMessageEl = document.getElementById("open-modal-message")
const modalTitleEl = document.getElementById("modal-title")


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

function showFailureMessage(block, message) {
    if(block === "url"){
        temporaryMessageUrlEl.innerHTML = `<p class="warning">${message}</p>`
    } else {
        temporaryMessageManualEl.innerHTML = `<p class="warning">${message}</p>`
    }
}

function updatTitle(type) {
    if(type === "normal") {
        modalTitleEl.innerHTML = `<p> Summary </p>`
    } else {
        modalTitleEl.innerHTML = `<p> Major Points </p>`
    }
}

function renderOutput(data1) {

    openModalMessageEl.textContent = "Process Complete, click below to open."
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

    const type = promptType
    openModalMessageEl.textContent = ""
    updatTitle(type)

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
                    showTemporaryMessage2(type, block)
                    const prompt = generatePrompt(type, content)
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

    const type = promptType
    openModalMessageEl.textContent = ""
    updatTitle(type)
    const block = "manual"

    const paragraph = inputEl.value

    if(paragraph){

        showTemporaryMessage2(type, block)
        const prompt = generatePrompt(type, paragraph)

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
    modalTitleEl.innerHTML = `<p> Major Points </p>`
    getSummaryUrl("bullet")
})

summarizeManualEl.addEventListener("click", function(){
    getSummaryManual("normal")
})

summarizeInBulletsManualEl.addEventListener("click", function() {
    modalTitleEl.innerHTML = `<p> Major Points </p>`
    getSummaryManual("bullet")
})