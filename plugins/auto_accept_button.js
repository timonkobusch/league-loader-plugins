const utils = require('./_utils')
let auto_accept = false

/** Called upon clicking the Auto Accept button. Enable/Disable queue auto acceptation */
function autoAcceptQueueButton(){
	let element = document.getElementById("autoAcceptQueueButton")
	if (element.attributes.selected != undefined) {
		auto_accept = false
		element.removeAttribute("selected")
	}
	else {
		element.setAttribute("selected", "true")
		auto_accept = true
	}
}

window.autoAcceptQueueButton = autoAcceptQueueButton

/** Called upon Match found. Accept the Matchmaking */
let autoAcceptCallback = async message => {
	utils.phase = JSON.parse(message["data"])[2]["data"]
	if (utils.phase == "ReadyCheck" && auto_accept) {
		await acceptMatchmaking()
		utils.phase = "ReadyCheckAccepted"
	}
}

/** Callback function to be sent in observerAddCallback(). Will create the Auto Accept button */
let autoAcceptMutationObserver = () => {
	if (document.querySelector(".v2-footer-notifications.ember-view") != null && document.getElementById("autoAcceptQueueButton") == null) {
		let newOption = document.createElement("lol-uikit-radio-input-option");
		newOption.setAttribute("id", "autoAcceptQueueButton");
		newOption.setAttribute("onclick", "window.autoAcceptQueueButton()");
		if (auto_accept){
			newOption.setAttribute("selected", "");
		}
		newOption.innerHTML = "Auto Accept";

		let parentElement = document.querySelector(".v2-footer-notifications.ember-view");
		parentElement.append(newOption);
	}
}

window.addEventListener('DOMContentLoaded', () => {
	utils.subscribe_endpoint('/lol-gameflow/v1/gameflow-phase', autoAcceptCallback)
	utils.observerAddCallback(autoAcceptMutationObserver)
})

let acceptMatchmaking = async () => await fetch('/lol-matchmaking/v1/ready-check/accept', { method: 'POST' })