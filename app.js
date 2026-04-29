function signup() {
    var name = document.getElementById("username").value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    var users = JSON.parse(localStorage.getItem("userdata")) || [];

    if (!name || !email || !password ) {
        Swal.fire("Error", "All fields are required!", "error");
        return;
    }

     if (!emailRegex.test(email)) {
        Swal.fire("Error", "Invalid Email!", "error");
        return;
    }

    if (!passwordRegex.test(password)) {
        Swal.fire(
            "Weak Password",
            "Password must be 8+ chars, include uppercase, lowercase, number & special character",
            "warning"
        );
        return;
    }

   var exist = users.some(user => user.email.toLowerCase() === email.toLowerCase());

    if (exist) {
        Swal.fire("Warning", "Email already exists!", "warning");
        return;
    }
    var userdata = {
        name: name,
        email: email,
        password: password
    }
    users.push(userdata);
    localStorage.setItem("userdata", JSON.stringify(users));

    Swal.fire("Success", "Signup successful!", "success")
        .then(() => window.location.href = "login.html");
}
function login() {
    var email = document.getElementById("loginEmail").value.trim();
    var password = document.getElementById("loginPassword").value.trim();
    var users = JSON.parse(localStorage.getItem("userdata")) || [];

    if (!email || !password) {
        Swal.fire("Error", "Please enter email and password", "error");
        return;
    }
    var userData = users.find(function (user) {
    return user.email.toLowerCase() === email.toLowerCase() && user.password === password;
});

    if (userData) {
        localStorage.setItem("currentUser", JSON.stringify(userData));

         Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: "Welcome back " + userData.name
        }).then(() => {
            window.location.href="cv.html"
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Invalid Login",
            text: "Email or password is incorrect"
        });
    }
}
document.addEventListener("DOMContentLoaded", function () {
    var createBtn = document.querySelector(".btn-create");
    if (createBtn) {
        createBtn.addEventListener("click", function (e) {
            e.preventDefault();
           if (!localStorage.getItem("currentUser")) {
        window.location.href = "login.html";
        return;
    }
            window.location.href = "resume.html";
        });
    }
});
function logout() {
    Swal.fire({
        title: "Are you sure you want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, logout",
        cancelButtonText: "No"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
        }
    });
}
//----resume-----//
var languages = [];

var langInput = document.getElementById("language");
var langContainer = document.getElementById("languages-container");

if (langInput) {
    langInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();

            var value = this.value.trim();
            if (value !== "") {
                languages.push(value);
                this.value = "";
                showLanguages();
            }
        }
    });
}

function showLanguages() {
    if (!langContainer) return;

    langContainer.innerHTML = "";

    languages.forEach(function (l, index) {
        var span = document.createElement("span");
        span.className = "badge bg-primary me-2";
        span.innerHTML = l;

        langContainer.appendChild(span);
    });
}
     var imageInput = document.getElementById("imgInput");
var previewImg = document.getElementById("previewImg");

if (imageInput && previewImg) {

    imageInput.addEventListener("change", function () {

        var file = this.files[0];

        if (!file) return;

        var reader = new FileReader();

        reader.onload = function (e) {

            previewImg.src = e.target.result;
            previewImg.style.display = "block";

            // SAVE IMAGE ALSO
            localStorage.setItem("cvImage", e.target.result);
        };

        reader.readAsDataURL(file);
    });
}
var cvForm = document.getElementById("cvForm");

if (cvForm) {
    cvForm.addEventListener("submit", function (e) {
        e.preventDefault();

        var cvData = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            summary: document.getElementById("summary").value.trim(),
            education: document.getElementById("education").value.trim(),
            experience: document.getElementById("experience").value.trim(),
            skills: document.getElementById("skills").value.trim(),
            languages: languages,
            image: localStorage.getItem("cvImage") // 👈 IMPORTANT
        };

        localStorage.setItem("cvData", JSON.stringify(cvData));

        window.location.href = "template.html";
    });
}
//---template ---//
document.addEventListener("DOMContentLoaded", function () {

    var cvData = JSON.parse(localStorage.getItem("cvData")) || {};

   var cvData = JSON.parse(localStorage.getItem("cvData"));

    var img = document.getElementById("cvImage");

    if (cvData && cvData.image && img) {
        img.src = cvData.image;
        img.style.display = "block";
    }
    if (document.getElementById("cvName"))
        document.getElementById("cvName").textContent = cvData.name || "Your Name";

    if (document.getElementById("cvEmail"))
        document.getElementById("cvEmail").textContent = cvData.email || "";

    if (document.getElementById("cvPhone"))
        document.getElementById("cvPhone").textContent = cvData.phone || "";

    if (document.getElementById("cvAbout"))
        document.getElementById("cvAbout").textContent = cvData.summary || "";

    if (document.getElementById("cvEducation"))
        document.getElementById("cvEducation").textContent = cvData.education || "";

    if (document.getElementById("cvExperience"))
        document.getElementById("cvExperience").textContent = cvData.experience || "";

  var skillsBox = document.getElementById("cvSkills");
    if (skillsBox) {
        skillsBox.innerHTML = "";
        var skills = cvData.skills ? cvData.skills.split(",") : [];

        skills.forEach(function (s) {
            var li = document.createElement("li");
            li.textContent = s.trim();
            skillsBox.appendChild(li);
        });
    }
    
    var langBox = document.getElementById("cvLanguages");
    if (langBox) {
        langBox.innerHTML = "";

        var langs = cvData.languages || [];

        langs.forEach(function (l) {
            var li = document.createElement("li");
            li.textContent = l;
            langBox.appendChild(li);
        });
    }

});
function loadTemplate(templateName) {
  const preview = document.getElementById("cvPreview");
  if (!preview) return;

  preview.className = `cv-template ${templateName}`;
  localStorage.setItem("selectedTemplate", templateName);
}


// ========================
// ACCENT COLOR
// ========================
function applyColor(color) {
  document.documentElement.style.setProperty("--accent", color);
  localStorage.setItem("accentColor", color);
}