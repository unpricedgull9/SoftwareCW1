// Modal Class
class Modal {
  // im so proud of this like 10% of the time, too many issues with confirm button
  static show(header, content, showCancel = false) {
    const modal = document.querySelector(".modal");
    const modalHeader = document.getElementById("modal-header");
    const modalContent = document.getElementById("modal-content");
    const modalCancelBtn = document.getElementById("modal-red");
    const modalConfirmBtn = document.getElementById("modal-green");

    this.hideMessage();

    // builds the modal
    modalHeader.textContent = header;
    modalContent.innerHTML = content;
    modalCancelBtn.hidden = !showCancel;

    // displays the modal
    modal.hidden = false;
  }

  // OLIVER it works most the time, sometimes button likes to stay disables after modal closes, probably error in other parts of code
  static hide() {
    TransactionTimer.clearTimer();
    const modal = document.querySelector(".modal");
    const modalConfirmBtn = document.getElementById("modal-green");
    modal.hidden = true;
    modalConfirmBtn.disabled = false;
  }

  // allows you to put a function in a parameter that gets called on when green button is clicked.
  static confirmFunction(callback) {
    const confirmBtn = document.getElementById("modal-green");
    confirmBtn.onclick = () => {
      callback();
    };
  }

  static message(message) {
    const modalMsg = document.getElementById("modal-msg");
    modalMsg.textContent = message;
    modalMsg.hidden = false;
  }

  static hideMessage() {
    const modalMsg = document.getElementById("modal-msg");
    modalMsg.textContent = "";
    modalMsg.hidden = true;
  }
}
