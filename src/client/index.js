import handleSubmit from "./js/formHandler";
import "./styles/resets.scss";
import "./styles/base.scss";
import "./styles/footer.scss";
import "./styles/form.scss";
import "./styles/header.scss";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("trip-form").onsubmit = handleSubmit;
});

export { handleSubmit as default };
