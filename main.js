import { summarizeText } from "./summarizer.js"
import { extractContent } from "./extract.js"

let myLinks = []

// const tabBtn = document.getElementById("tab-btn")
// const deleteBtn = document.getElementById("delete-btn")
const ulEl = document.getElementById("ul-el")
const pEl = document.getElementById("p-el")
const summarizeUrlEl = document.getElementById("summarize-url")
const summarizeInBulletsUrlEl = document.getElementById("summarize-in-bullets-url")
const temporaryMessageUrlEl = document.getElementById("temporary-message-url")
const inputEl = document.getElementById("input-el")
const summarizeManualEl = document.getElementById("summarize-manual")
const summarizeInBulletsManualEl = document.getElementById("summarize-in-bullets-manual")
const temporaryMessageManualEl = document.getElementById("temporary-message-manual")
const outputDivEl = document.getElementById("output-div")


// Render the links that are already in localStorage whenever we open the extention.
const linksFromLocalStorage = JSON.parse(localStorage.getItem("myLinks"))
if(linksFromLocalStorage){
    myLinks = linksFromLocalStorage
    render(myLinks)
}

// Render function is to show the list items and heading.
function render(links){
    let listItems = ""
    for(let i = 0; i<links.length; i++){
        listItems += `
                        <li>
                            <a href="${links[links.length - i - 1]}" target="_blank">
                                ${links[links.length - i - 1]}
                            </a>
                        </li>
                    `
    }

    // Add the heading about last summarized articles if any summarized
    if(links.length > 0){
        pEl.textContent = `Last summarized articles`
    }

    ulEl.innerHTML = listItems
}

function showTemporaryMessage1() {
    temporaryMessageUrlEl.innerHTML = `<p class="message">Getting page content to summarize. It can take upto 60sec, please wait while we process</p>`
}

function showTemporaryMessage2(block) {
    if(block === "url"){
        temporaryMessageUrlEl.innerHTML = `<p class="message">Summarizing page content. It can take upto 60sec, please wait while we process</p>`
    } else {
        temporaryMessageManualEl.innerHTML = `<p class="message">Summarizing page content. It can take upto 60sec, please wait while we process</p>`
    }    
}

function showFailureMessage(message) {
    temporaryMessageUrlEl.innerHTML = `<p class="warning">${message}</p>`
}

function renderOutput(data1) {

    
    const dataArray = data1.split("- ")
    // console.log(dataArray)
    outputDivEl.innerHTML = ``

    for(let i=0; i<dataArray.length; i++){
        outputDivEl.innerHTML += `<p>- ${dataArray[i]}</p>`
    }
}

function generatePrompt(type, text){
    if(type === "bullet")
        return `Please summarize the following text in form of bullet points and complete the last sentence with a ".": ${text}`
    else
        return `Please summarize the following text: ${text}`
     
}

// Get url of the page
function getSummary(promptType) {
    console.log("getSummary Entered")
    try{

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            const tab = tabs[0].url
            
            showTemporaryMessage1()
            extractContent(tab).then(data => {
                let content = JSON.stringify(data.main)

                
                if(content === `"Unprocessed"`) {
                    // outputDivEl.innerHTML = `<p> ${content} </p>`
                    content = `Something happened, Unable to get page data.\n   Server side error\n Try manual summarization if error repeates.`
                    // renderOutput(content)
                    showFailureMessage(content)
                } else {
                    showTemporaryMessage2("url")
                    const prompt = generatePrompt(promptType, content)
                    summarizeText(prompt).then(mainContent => {

                        renderOutput(mainContent)
                        // outputDivEl.innerHTML = `<p> ${mainContent} </p>`
                    })
                }

            })
        })
    } catch(err){
        console.error(err)
        const message = "Unable to load url"
        showFailureMessage(message)
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
    getSummary("normal")
})

summarizeInBulletsUrlEl.addEventListener("click", function() {
    // console.log("Calling getSummary ")
    getSummary("bullet")
})

summarizeManualEl.addEventListener("click", function(){
    showTemporaryMessage2("manual")
    const paragraph = inputEl.value
    const prompt = generatePrompt("normal", paragraph)

    summarizeText(prompt).then(data => {
        // outputDivEl.innerHTML = `<p> ${data} </p>`
        temporaryMessageManualEl.innerHTML = ""
        renderOutput(data)
    })
})


// Summarize the text inserted by user in input box
summarizeInBulletsManualEl.addEventListener("click", function() {
    showTemporaryMessage2("manual")
    // Get value from input box
    const paragraph = inputEl.value
    const prompt = generatePrompt("bullet", paragraph)
    // Call the summarizeText which is imported from summarizer.js
    summarizeText(prompt).then(data => {
        // const dataArray = data.split("-")
        // console.log(dataArray)
        // for(let i=0; i<dataArray.length; i++){
        //     outputDivEl.innerHTML += `<p>- ${dataArray[i]}</p>`
        // }
        temporaryMessageManualEl.innerHTML = ""
        renderOutput(data)
        
    })


})