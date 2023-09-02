const openModalButtons = document.querySelectorAll("[data-modal-target]")
const closeModalButtons = document.querySelectorAll("[data-close-button]")
const overlayEl = document.getElementById("overlay")

openModalButtons.forEach(button => {
    button.addEventListener("click", () => {

        document.body.style.minWidth = "800px"
        document.body.style.minHeight = "600px"
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = button.closest(".modal")
        closeModal(modal)
        document.body.style.minWidth = "300px"
        document.body.style.minHeight = "400px"
    })
})

overlayEl.addEventListener("click", () => {
    const modals = document.querySelectorAll(".modal.active")
    modals.forEach(modal => {
        closeModal(modal)
        document.body.style.minWidth = "300px"
        document.body.style.minHeight = "400px"
    })
})

function openModal() {
    if(modal == null) return
    modal.classList.add("active")
    overlayEl.classList.add("active")
}

function closeModal() {
    if(modal == null) return
    modal.classList.remove("active")
    overlayEl.classList.remove("active")
}