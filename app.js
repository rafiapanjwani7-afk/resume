function signup() {
    var name = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var phone = document.getElementById("phone").value;
    var cnic = document.getElementById("cnic").value;

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    var phoneRegex = /^03\d{9}$/;
    var cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

    var users = JSON.parse(localStorage.getItem("userdata")) || [];

    if (!name || !email || !password || !phone || !cnic) {
        alert("All fields are required!");
        return;
    }

    if (!emailRegex.test(email)) return alert("Invalid Email!");
    if (!passwordRegex.test(password)) return alert("Weak Password!");
    if (!phoneRegex.test(phone)) return alert("Invalid Phone Number!");
    if (!cnicRegex.test(cnic)) return alert("Invalid CNIC!");

    var exist = users.some(user => user.email === email);

    if (exist) {
        Swal.fire("Warning", "Email already exists!", "warning");
        return;
    }

    var userdata = { name, email, password, phone, cnic };

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

    var userData = users.find(u => u.email === email && u.password === password);

    if (userData) {
        localStorage.setItem("currentUser", JSON.stringify(userData));

        Swal.fire("Success", "Login successful!", "success")
            .then(() => window.location.href = "resume.html");
    } else {
        Swal.fire("Error", "Invalid email or password", "error");
    }
}
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

function renderResume(data) {
    var container = document.getElementById("resumeContainer");
    container.innerHTML = `
    <div id="resume" class="p-4 bg-white shadow rounded">

      <h1>${data.name || ""}</h1>
      <h4>${data.title || ""}</h4>
      <p>${data.email || ""} | ${data.phone || ""}</p>

      <hr>

      <h5>Summary</h5>
      <p>${data.summary || ""}</p>

      <h5>Education</h5>
      <p>${data.education || ""}</p>

      <h5>Experience</h5>
      <p>${data.experience || ""}</p>

      <h5>Skills</h5>
     <p>
     ${(data.skills || []).map(s => `<span>${s}</span>`).join("")}
     </p>

    </div>
  `;
}
function saveResume() {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    var data = {
        name: document.getElementById("name").value,
        title: document.getElementById("title").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        summary: document.getElementById("summary").value,
        education: document.getElementById("education").value,
        experience: document.getElementById("experience").value,
        skills: document.getElementById("skills").value.split(",").map(s => s.trim())
    };

    localStorage.setItem("resumeData", JSON.stringify(data));

    renderResume(data);

    Swal.fire("Saved", "Resume generated!", "success");
}
function autoSave() {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    var data = {
        name: document.getElementById("name").value,
        title: document.getElementById("title").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        summary: document.getElementById("summary").value,
        education: document.getElementById("education").value,
        experience: document.getElementById("experience").value,
        skills: document.getElementById("skills").value.split(",").map(s => s.trim())
    };

    localStorage.setItem("resumeData", JSON.stringify(data));
 window.location.href = "template.html";
    renderResume(data);
}
window.onload = function () {
    var data = JSON.parse(localStorage.getItem("resumeData"));

    if (data) {
        document.getElementById("name").value = data.name || "";
        document.getElementById("title").value = data.title || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("phone").value = data.phone || "";
        document.getElementById("summary").value = data.summary || "";
        document.getElementById("education").value = data.education || "";
        document.getElementById("experience").value = data.experience || "";
        document.getElementById("skills").value = (data.skills || []).join(",");

        renderResume(data);
    }
};
var data = JSON.parse(localStorage.getItem("resumeData"));

if (data) {
    document.getElementById("namePreview").innerText = data.name || "";
    document.getElementById("titlePreview").innerText = data.title || "";
    document.getElementById("contactPreview").innerText =
        (data.email || "") + " | " + (data.phone || "");

    document.getElementById("summaryPreview").innerText = data.summary || "";
    document.getElementById("educationPreview").innerText = data.education || "";
    document.getElementById("experiencePreview").innerText = data.experience || "";

    document.getElementById("skillsPreview").innerHTML =
        (data.skills || []).map(s => `• ${s}`).join("<br>");
}
function updatePreview() {
   
    document.getElementById("namePreview").innerText =
        document.getElementById("name").value;

    document.getElementById("titlePreview").innerText =
        document.getElementById("title").value;

    document.getElementById("contactPreview").innerText =
        document.getElementById("email").value +
        " | " +
        document.getElementById("phone").value;

    document.getElementById("summaryPreview").innerText =
        document.getElementById("summary").value;

    document.getElementById("educationPreview").innerText =
        document.getElementById("education").value;

    document.getElementById("experiencePreview").innerText =
        document.getElementById("experience").value;

    document.getElementById("skillsPreview").innerHTML =
        document.getElementById("skills").value
            .split(",")
            .map(s => "• " + s.trim())
            .join("<br>");
}function loadTemplateSelector() {
    var container = document.getElementById("templateSelector");

    var select = document.createElement("select");
    select.className = "form-control mb-3";

    var templates = [
        { value: "modern", text: "Modern" },
        { value: "classic", text: "Classic" },
        { value: "creative", text: "Creative" }
    ];

    templates.forEach(t => {
        var option = document.createElement("option");
        option.value = t.value;
        option.textContent = t.text;
        select.appendChild(option);
    });

    select.addEventListener("change", function () {
        setTemplate(this.value);
    });

    container.appendChild(select);
}