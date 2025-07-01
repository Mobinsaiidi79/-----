document.addEventListener('DOMContentLoaded', function() {
    // تابع تبدیل تاریخ میلادی به شمسی
    function gregorianToPersian(date) {
        const pDate = new PersianDate(date);
        return {
            year: pDate.year(),
            month: pDate.month() + 1,
            day: pDate.date(),
            hour: pDate.hour(),
            minute: pDate.minute()
        };
    }
    
    // تابع محاسبه زمان باقیمانده
    function updateCountdown() {
        const deadlineStr = localStorage.getItem('articleDeadline');
        
        if (!deadlineStr) {
            document.getElementById('countdown-container').classList.add('hidden');
            document.getElementById('auth-required-alert').classList.remove('hidden');
            return;
        }
        
        const deadline = new Date(deadlineStr);
        const now = new Date();
        const diff = deadline - now;
        
        if (diff <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('deadline-text').textContent = 'مهلت ارسال به پایان رسیده است';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        
        // نمایش تاریخ شمسی
        const pDate = gregorianToPersian(deadline);
        document.getElementById('deadline-text').textContent = 
            `تا تاریخ ${pDate.year}/${pDate.month.toString().padStart(2, '0')}/${pDate.day.toString().padStart(2, '0')} ساعت ${pDate.hour.toString().padStart(2, '0')}:${pDate.minute.toString().padStart(2, '0')}`;
    }
    
    // بررسی وضعیت احراز هویت برای نمایش تایمر
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        document.getElementById('auth-required-alert').classList.remove('hidden');
    } else {
        document.getElementById('countdown-container').classList.remove('hidden');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 60000); // هر دقیقه آپدیت شود
});