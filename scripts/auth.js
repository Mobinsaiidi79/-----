// مدیریت وضعیت احراز هویت
document.addEventListener('DOMContentLoaded', function() {
    // شبیه‌سازی وضعیت کاربر
    let user = JSON.parse(localStorage.getItem('user')) || {
        isLoggedIn: false,
        isAdmin: false,
        name: "",
        email: ""
    };
    
    // بررسی وضعیت کاربر
    updateAuthUI();
    
    // مدیریت دکمه احراز هویت
    document.getElementById('auth-btn')?.addEventListener('click', showAuthModal);
    document.getElementById('mobile-auth-btn')?.addEventListener('click', showAuthModal);
    
    // مدیریت دکمه خروج
    document.getElementById('logout-btn')?.addEventListener('click', logoutUser);
    document.getElementById('mobile-logout-btn')?.addEventListener('click', logoutUser);
    
    // مدیریت منوی موبایل
    document.getElementById('mobile-menu-btn')?.addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    });
    
    // مدیریت مدال احراز هویت
    const authModal = document.getElementById('auth-modal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authContents = document.querySelectorAll('.auth-content');
    
    // بستن مدال
    document.getElementById('close-auth-modal')?.addEventListener('click', function() {
        authModal.classList.add('hidden');
    });
    
    // تغییر تب‌های مدال
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchAuthTab(tabName);
        });
    });
    
    // مدیریت فرم‌ها
    document.getElementById('login-form')?.addEventListener('submit', loginUser);
    document.getElementById('register-form')?.addEventListener('submit', registerUser);
    
    // توابع
    
    function showAuthModal() {
        switchAuthTab('login');
        authModal.classList.remove('hidden');
    }
    
    function switchAuthTab(tabName) {
        // تغییر استایل تب‌ها
        authTabs.forEach(t => {
            if(t.getAttribute('data-tab') === tabName) {
                t.classList.add('text-blue-600', 'border-blue-600');
                t.classList.remove('text-gray-500');
            } else {
                t.classList.remove('text-blue-600', 'border-blue-600');
                t.classList.add('text-gray-500');
            }
        });
        
        // تغییر محتوا
        authContents.forEach(content => {
            if(content.id === `${tabName}-form`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });
        
        // تغییر عنوان مدال
        document.getElementById('auth-modal-title').textContent = 
            tabName === 'login' ? 'ورود به حساب کاربری' : 'ثبت‌نام در جشنواره';
    }
    
    function loginUser(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // اعتبارسنجی ساده
        if(!email || !password) {
            Swal.fire({
                title: 'خطا',
                text: 'لطفاً ایمیل و رمز عبور را وارد کنید',
                icon: 'error'
            });
            return;
        }
        
        // در حالت واقعی اینجا درخواست به سرور ارسال می‌شود
        // این فقط یک شبیه‌سازی است
        user = {
            isLoggedIn: true,
            isAdmin: email === 'admin@example.com', // کاربر با این ایمیل ادمین است
            name: email === 'admin@example.com' ? 'مدیر سیستم' : 'کاربر مهمان',
            email: email
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        
        Swal.fire({
            title: 'ورود موفق',
            text: 'با موفقیت وارد حساب کاربری خود شدید.',
            icon: 'success'
        }).then(() => {
            authModal.classList.add('hidden');
            updateAuthUI();
            window.location.reload();
        });
    }
    
    function registerUser(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // اعتبارسنجی
        if(!name || !email || !password || !confirmPassword) {
            Swal.fire({
                title: 'خطا',
                text: 'لطفاً تمام فیلدها را پر کنید',
                icon: 'error'
            });
            return;
        }
        
        if(password !== confirmPassword) {
            Swal.fire({
                title: 'خطا',
                text: 'رمز عبور و تکرار آن مطابقت ندارند',
                icon: 'error'
            });
            return;
        }
        
        // در حالت واقعی اینجا درخواست به سرور ارسال می‌شود
        user = {
            isLoggedIn: true,
            isAdmin: false,
            name: name,
            email: email
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        
        Swal.fire({
            title: 'ثبت‌نام موفق',
            text: 'حساب کاربری شما با موفقیت ایجاد شد.',
            icon: 'success'
        }).then(() => {
            authModal.classList.add('hidden');
            updateAuthUI();
            window.location.reload();
        });
    }
    
    function logoutUser() {
        Swal.fire({
            title: 'آیا مطمئن هستید؟',
            text: 'می‌خواهید از حساب کاربری خود خارج شوید؟',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'بله، خارج شوید',
            cancelButtonText: 'انصراف'
        }).then((result) => {
            if (result.isConfirmed) {
                user = {
                    isLoggedIn: false,
                    isAdmin: false,
                    name: "",
                    email: ""
                };
                localStorage.setItem('user', JSON.stringify(user));
                window.location.reload();
            }
        });
    }
    
    function updateAuthUI() {
        if(user.isLoggedIn) {
            // نمایش منوی کاربر
            document.getElementById('user-menu')?.classList.remove('hidden');
            document.getElementById('mobile-user-menu')?.classList.remove('hidden');
            
            // نمایش نام کاربر
            document.getElementById('username-display').textContent = user.name;
            document.getElementById('mobile-username-display').textContent = user.name;
            
            // مخفی کردن منوی مهمان
            document.getElementById('guest-menu')?.classList.add('hidden');
            document.getElementById('mobile-guest-menu')?.classList.add('hidden');
            
            // اگر کاربر ادمین باشد
            if(user.isAdmin) {
                document.getElementById('admin-link')?.classList.remove('hidden');
                document.getElementById('mobile-admin-link')?.classList.remove('hidden');
            }
        } else {
            // نمایش منوی مهمان
            document.getElementById('guest-menu')?.classList.remove('hidden');
            document.getElementById('mobile-guest-menu')?.classList.remove('hidden');
            
            // مخفی کردن منوی کاربر
            document.getElementById('user-menu')?.classList.add('hidden');
            document.getElementById('mobile-user-menu')?.classList.add('hidden');
        }
    }
});