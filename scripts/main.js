// مدیریت منوی موبایل و سایر توابع عمومی - نسخه نهایی
document.addEventListener('DOMContentLoaded', function() {
    // ابتدا وضعیت احراز هویت را بررسی کنید
    checkAuthStatus();
    
    // مدیریت منوی موبایل
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // اسکرول نرم به بخش‌ها
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // انیمیشن‌های اسکرول
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animateElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }

    // بستن راهنمای اولیه
    window.closeGuide = function() {
        const introGuide = document.getElementById('intro-guide');
        if (introGuide) {
            introGuide.style.display = 'none';
            localStorage.setItem('guideClosed', 'true');
        }
    };

    // بررسی آیا کاربر قبلاً راهنما را دیده است
    if (localStorage.getItem('guideClosed') === 'true') {
        const introGuide = document.getElementById('intro-guide');
        if (introGuide) introGuide.style.display = 'none';
    }
});

// مدیریت فرم تماس
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        Swal.fire({
            icon: 'success',
            title: 'پیام شما ارسال شد!',
            text: 'در اسرع وقت با شما تماس خواهیم گرفت.',
            confirmButtonText: 'متشکرم'
        });
        this.reset();
    });
}

// تابع بررسی وضعیت احراز هویت - نسخه نهایی
function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('user')) || { isLoggedIn: false };
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
    
    // بررسی تطابق توکن در localStorage و sessionStorage
    const isValidSession = (user.token && currentUser.token && user.token === currentUser.token);
    
    // برای صفحه ادمین
    if (window.location.pathname.includes('admin.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const authToken = urlParams.get('auth');
        
        // بررسی چهارگانه برای امنیت بیشتر
        const isAuthenticated = (
            user.isLoggedIn && 
            user.isAdmin && 
            isValidSession &&
            user.token === authToken
        );
        
        if (!isAuthenticated) {
            // پاکسازی و ریدایرکت
            localStorage.removeItem('user');
            sessionStorage.removeItem('currentUser');
            window.location.replace('index.html');
            return;
        }
    }
    
    // برای صفحه داشبورد کاربری
    if (window.location.pathname.includes('dashboard.html') && !user.isLoggedIn) {
        window.location.href = 'index.html';
    }
}

// بررسی وضعیت در هر تغییر مسیر
window.addEventListener('popstate', function() {
    checkAuthStatus();
});