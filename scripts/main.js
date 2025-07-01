// مدیریت منوی موبایل
import './auth.js';
document.addEventListener('DOMContentLoaded', function() {
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
                
                // بستن منوی موبایل در صورت باز بودن
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // انیمیشن‌های اسکرول
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });

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
        if (introGuide) {
            introGuide.style.display = 'none';
        }
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

function protectDashboard() {
    if (window.location.pathname.includes('dashboard.html')) {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            window.location.href = 'index.html';
        }
    }
}

document.addEventListener('DOMContentLoaded', protectDashboard);