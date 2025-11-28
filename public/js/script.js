(() => {
	"use strict";

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.querySelectorAll(".needs-validation");

	// Loop over them and prevent submission
	Array.from(forms).forEach((form) => {
		form.addEventListener(
			"submit",
			(event) => {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}

				form.classList.add("was-validated");
			},
			false
		);
	});
})();

// if (window.history.replaceState) {
// 	window.history.replaceState({}, document.title, "/listings");
// }

setTimeout(() => {
	const alertElement = document.getElementById("myAlert");
	if (alertElement) {
		const bsAlert = bootstrap.Alert.getOrCreateInstance(alertElement);
		bsAlert.close();
	}
}, 500);

setTimeout(() => {
	const alertElement = document.getElementById("closeAlert");
	if (alertElement) {
		const bsAlert = bootstrap.Alert.getOrCreateInstance(alertElement);
		bsAlert.close();
	}
}, 5000);
