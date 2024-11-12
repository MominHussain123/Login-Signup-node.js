let logout = () => {
    let token = localStorage.getItem("token");
    if (token === null || token === undefined) {
        window.location.href = "login.html";
    }
    else {
        token = null;
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}
let token = localStorage.getItem("token");
if (token === null || token === undefined) {
    window.location.href = "login.html";
}