import { summarizeText } from "../summarizer.js"
import { extractContent } from "../extract.js"

// let myLinks = []

// const tabBtn = document.getElementById("tab-btn")
// const deleteBtn = document.getElementById("delete-btn")
// const ulEl = document.getElementById("ul-el")
// const pEl = document.getElementById("p-el")
const summarizeUrlEl = document.getElementById("summarize-url")
const summarizeInBulletsUrlEl = document.getElementById("summarize-in-bullets-url")
const temporaryMessageUrlEl = document.getElementById("temporary-message-url")
const inputEl = document.getElementById("input-el")
const summarizeManualEl = document.getElementById("summarize-manual")
const summarizeInBulletsManualEl = document.getElementById("summarize-in-bullets-manual")
const temporaryMessageManualEl = document.getElementById("temporary-message-manual")
// const summaryContentEl = document.getElementById("summary-content")
const modalBodyEl = document.getElementById("modal-body")
const openModalMessageEl = document.getElementById("open-modal-message")


// Render the links that are already in localStorage whenever we open the extention.
// const linksFromLocalStorage = JSON.parse(localStorage.getItem("myLinks"))
// if(linksFromLocalStorage){
//     myLinks = linksFromLocalStorage
//     render(myLinks)
// }

// Render function is to show the list items and heading.
// function render(links){
//     let listItems = ""
//     for(let i = 0; i<links.length; i++){
//         listItems += `
//                         <li>
//                             <a href="${links[links.length - i - 1]}" target="_blank">
//                                 ${links[links.length - i - 1]}
//                             </a>
//                         </li>
//                     `
//     }

//     // Add the heading about last summarized articles if any summarized
//     if(links.length > 0){
//         pEl.textContent = `Last summarized articles`
//     }

//     ulEl.innerHTML = listItems
// }

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

    // openModalBtnEl.innerHTML = ``
    openModalMessageEl.textContent = "Summary is ready, click below to open."
    const dataArray = data1.split("- ")
    // console.log(dataArray)
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
        return `Please summarize the following text in form of bullet points and every point should have maximum 12 words with a full stop(.) at the end of sentence: ${text}`
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
    // console.log("getSummary Entered")

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
                    // outputDivEl.innerHTML = `<p> ${content} </p>`
                    // renderOutput(content)
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
                        
                        // outputDivEl.innerHTML = `<p> ${mainContent} </p>`
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
        // Call the summarizeText which is imported from summarizer.js
        summarizeText(prompt).then(mainContent => {
            // const dataArray = data.split("-")
            // console.log(dataArray)
            // for(let i=0; i<dataArray.length; i++){
            //     outputDivEl.innerHTML += `<p>- ${dataArray[i]}</p>`
            // }

            if(mainContent === "Unprocessed"){
                showFailureMessage(block, getFailureMessage("summarizing"))
            } else {
                temporaryMessageManualEl.innerHTML = ""
                renderOutput(mainContent)
            }

            // temporaryMessageManualEl.innerHTML = ""
            // renderOutput(mainContent)
            
        })
    } else {
        const message = "Please provide text."
        showFailureMessage(block, message)
    }
}

// function summarizeInBulletsUrlEl() {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//         const tab = tabs.url[0].url

//         extractContent(tab).then(data => {
//             const content = JSON.stringify(data.main)

//             if(content === `"Unprocessed"`) {
//                 outputDivEl.innerHTML = `<p> ${content} </p>`
//             } else {
//                 const prompt = generatePromptBullet(content)
//                 summarizeText(prompt).then(mainContent => {

//                     renderOutput(mainContent)
                    
//                 })
//             }

//         })
//     })
// }


// Get the url of currently opened page to get summary of it
// tabBtn.addEventListener("click", function(){
//     // Use Google's chrome.tabs API to fetch the url of the tab and then push it in myLinks. Also update the localStorage.
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//         const tab = tabs[0].url

//         // Below if condition will make sure that we have only last two article links in our links' history, not more than that.
//         if(myLinks.length > 1){
//             myLinks[0] = myLinks[1]
//             myLinks.pop()
//             myLinks.push(tab)
//         } else {
//             myLinks.push(tab)
//         }

//         localStorage.setItem("myLinks", JSON.stringify(myLinks))
//         render(myLinks)
//     })
// })


// Delete the history by double clicking the Delete button
// deleteBtn.addEventListener("dblclick", function(){
//     localStorage.clear()
//     myLinks = []

//     // Remove the heading after deleting history
//     pEl.textContent = ""
//     render(myLinks)
// })

summarizeUrlEl.addEventListener("click", function() {
    // console.log("Calling getSummary ")
    getSummaryUrl("normal")
})

summarizeInBulletsUrlEl.addEventListener("click", function() {
    // console.log("Calling getSummary ")
    getSummaryUrl("bullet")
})

summarizeManualEl.addEventListener("click", function(){
    getSummaryManual("normal")
})


// Summarize the text inserted by user in input box
summarizeInBulletsManualEl.addEventListener("click", function() {

    // Get value from input box
    getSummaryManual("bullet")


})