# Summarizer-Extension

## Project:
Name: Summarizer \
Version: 2.0

## Description:
Summarizer is a plugin or extension which can generate summary of the text content of a page. It can also get some major points from the text. It can directly generate summary of page content without the need of us providing the text and it can also generate summary while we provide the text to it manually.
This version of the summarizer at this time can process data of bbc/news articles.

Update: In this version user can get both, summary and major points, in single request. \
It reduces the response time, cost per request and inproves the user experience.

## Features:
* It is Responsive and attractive UI enabled.
* Works well with both mobile and desktop.
* Looks so appealing and intuitive.
* Provides good user Experience.
* Handles transactional and network errors.
* Provides related temporary messages while server is loading, for good user Experience.
* Provides easy access and use.
* Provides option to the user to get desired result. (In form of summary or in form of major points.)
* User can copy the result text to clipboard.

## Working:
Summarizer is an extension deployed to chrome. It works only when network is connected. We can easily access the extension from our saved extensions.

### Working of Generate Directly:
Generate Directly feature is fully automated. User needs only one click of button to get the desired output.\
When user clicks the button of Generate Directly section, it sends a request to chrome.tabs API to get the url of the current active or open tab.\
After getting the url of the active tab, it is sent to the extractor to extract the data from page of our need.\
Extractor returns the page data which we need to process on user’s request, in the form of an object, which contains array of data to be processed.\
Extractor can also return the error message object in case of request failure.\
This array of data is then converted into string to pass further.\
This converted string is then sent to the Summarizer.\
Before sending the string to the summarizer, string is checked for failure message.\
Then if it is not failure message then Prompt is generated to tell the summarizer which operation to perform.\
Summarizer then takes the prompt (includes string to process) and sends request to the OpenAI API to perform the summarization.\
Modal which is used in this request is gpt-3.5-turbo.\
It generates response in JSON format which contains the output text.\
Get the output from the response (which is a string) and return it to the main code.\
In main code it is checked that if we have got the desired output or the summarizer has sent the error message, indicating failure of request.\
If summarizer has successfully returned the desired text, then it is rendered to the DOM and Displayed on screen.\
It also shows some temporary messages at every step, when it processes data, it helps in good user experience.\

### Working of Generate Manually:
Generate Manually feature is not fully automated. User needs to enter the text and one click of button to get the desired output.\
When user clicks the button of Generate Manually section input box’s value is sent for summarization.\
Before sending the value to summarizer it checks if user really have entered the value to input or not.\
If no value has been inserted then the process is terminated a message to provide the input text first.\
If text has been inserted, then Prompt is generated to tell the summarize which operation to perform.\
Summarizer then takes the prompt (includes string to process) and sends request to the OpenAI API to perform the summarization.\
Modal which is used in this request is gpt-3.5-turbo.\
It generates response in JSON format which contains the output text.\
Get the output from the response (which is a string) and return it to the main code.\
In main code it is checked that if we have got the desired output or the summarizer has sent the error message, indicating failure of request.\
If summarizer has successfully returned the desired text, then it is rendered to the DOM and Displayed on screen.\
It also shows some temporary messages at every step, when it processes data, it helps in good user experience.


## Set up and Run
This document explains the set-up and working of the plugin/extension.

### Set up:
It’s very easy to set up this tool.\
At this time the tool is locally deployed and not deployed to the google chrome web store.\
Once it is deployed on chrome web store, to set up the extension, one can do the following:
* Open chrome web store.
* Search the summarizer on search bar.
* Select the Summarizer extension.
* Click on the Add to Chrome button on top right of the screen.
* A prompt will appear on top of the screen, click Add extension.
* Extension has been successfully added to the chrome.


### Access and Run:
Running this extension is even more easy.\
This extension provides two types of functionalities:
* Generate Directly
* Generate Manually

#### Run Generate Directly:
* Go to chrome browser.
* Open an article which is to be summarize. (At this time, it supports only bbc-news articles)
* Go to extension toggle on top right of chrome browser and click on it.
* All of your added extensions will appear.
* Search the Summarizer extension in the list and click on it.
* Extension window will open on top right corner of chrome browser.
* There are three sections of the extension:
  * Generate Directly
  * Generate Manually
  * Show Result
* Click on the SUMMARIZE button of Generate Directly section and it will generate both, summary and major points of the page content.
* Server can take up-to 60 sec to generate the result.
* After the process completes, we can see a message at Result section which will ask us to click the button below to see the result.
* Click on the Open Summary button and it will open a popup window with summary.
* Click on the Open Major Points button and it will open a popup window with major points.

#### Run Generate Manually:
* Go to chrome browser.
* Open an article which is to be summarize. (At this time, it supports only bbc-news articles)
* Select the text content of the page that you want to summarize or get major points.
* Copy the selected text.
* Go to extension toggle on top right of chrome browser and click on it.
* All of your added extensions will appear.
* Search the Summarizer extension in the list and click on it.
* Extension window will open on top right corner of chrome browser.
* There are three sections of the extension:
  * Generate Directly
  * Generate Manually
  * Show Result
* Paste the copied text into the input box of Generate Manually section.
* Click on the SUMMARIZE button of Generate Manually section and it will generate both, summary and major points of the content.
* Server can take up-to 60 sec to generate the result.
* After the process completes, we can see a message at Result section which will ask us to click the button below to see the result.
* Click on the Open Summary button and it will open a popup window with summary.
* Click on the Open Major Points button and it will open a popup window with major points.
