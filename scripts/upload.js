// upload.js
// این فایل می‌تواند برای مدیریت آپلود فایل‌های پیشرفته‌تر استفاده شود
function handleFileUpload(file, callback) {
    if (!file) {
        callback({ success: false, message: 'هیچ فایلی انتخاب نشده است.' });
        return;
    }
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
        callback({ success: false, message: 'لطفاً فقط فایل‌های PDF یا DOCX آپلود کنید.' });
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        callback({ success: false, message: 'حجم فایل نباید بیشتر از 10 مگابایت باشد.' });
        return;
    }
    // شبیه‌سازی آپلود فایل
    setTimeout(() => {
        callback({ success: true, message: 'فایل با موفقیت آپلود شد.', fileName: file.name });
    }, 1000);
}