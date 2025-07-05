// auth.js
function loginUser(email, password, isAdmin = false) {
    const user = {
        email: email,
        name: email.split('@')[0], // نام پیش‌فرض از ایمیل استخراج می‌شود
        isLoggedIn: true,
        isAdmin: isAdmin,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('user_data', JSON.stringify(user));
    return user;
}

function logoutUser() {
    localStorage.removeItem('user_data');
}

function getUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
}

function checkLoginStatus() {
    const user = getUser();
    if (user && user.isLoggedIn) {
        return user;
    }
    return null;
}