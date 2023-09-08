/** Get Required Elements to update the DOM. */
const openModalButtons = document.querySelectorAll("[data-modal-target]")
const closeModalButtons = document.querySelectorAll("[data-close-button]")
const overlayEl = document.getElementById("overlay")

/** Below code is make every modal button work and open the connected modal. */
openModalButtons.forEach(button => {

    button.addEventListener("click", () => {

        /** Update the style of body so that the modal can be seen completely. */
        document.body.style.minWidth = "800px"
        document.body.style.minHeight = "600px"
        const modal = document.querySelector(button.dataset.modalTarget)

        /** Call openModal. */
        openModal(modal)
    })
})

/** Below code is make every modal button work and close the connected modal. */
closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {

        /** Get the closest element with specified selector and store in variable. */
        const modal = button.closest(".modal")

        /** Call closeModal */
        closeModal(modal)
        /** Update the style of body and set it to previous value. */
        document.body.style.minWidth = "300px"
        document.body.style.minHeight = "400px"
    })
})

/**  Below code is to activate the overlay background and make it close the modal while clicking anywhere on it. */
overlayEl.addEventListener("click", () => {
    const modals = document.querySelectorAll(".modal.active")
    modals.forEach(modal => {
        closeModal(modal)
        document.body.style.minWidth = "300px"
        document.body.style.minHeight = "400px"
    })
})


/** Define function to add the class active to modal and overlay, and make it visible. */
function openModal(modal) {
    if(modal == null) return
    modal.classList.add("active")
    overlayEl.classList.add("active")
}

/** Define function to remove the class active from modal and overlay, and make it hidden. */
function closeModal(modal) {
    if(modal == null) return
    modal.classList.remove("active")
    overlayEl.classList.remove("active")
}