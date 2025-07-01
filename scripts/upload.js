document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('article-file');
    const dropZone = document.getElementById('drop-zone');
    const previewContainer = document.getElementById('file-preview-container');
    const fileNameElement = document.getElementById('file-name');
    const fileSizeElement = document.getElementById('file-size');
    const removeBtn = document.getElementById('remove-file');
    const submissionForm = document.getElementById('submission-form');

    if (!fileInput || !dropZone) return;

    // Drag and Drop
    ['dragover', 'dragenter'].forEach(event => {
        dropZone.addEventListener(event, (e) => {
            e.preventDefault();
            dropZone.classList.add('active');
        });
    });

    ['dragleave', 'dragend'].forEach(event => {
        dropZone.addEventListener(event, () => {
            dropZone.classList.remove('active');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            showFilePreview(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            showFilePreview(fileInput.files[0]);
        }
    });

    removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.value = '';
        previewContainer.classList.add('hidden');
    });

    function showFilePreview(file) {
        if (file.size > 10 * 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'حجم فایل زیاد است',
                text: 'حداکثر حجم مجاز 10MB می‌باشد',
                confirmButtonText: 'متوجه شدم'
            });
            return;
        }

        fileNameElement.textContent = file.name;
        fileSizeElement.textContent = `${(file.size / (1024 * 1024)).toFixed(2)}MB`;
        previewContainer.classList.remove('hidden');
    }

    // ارسال فرم
    if (submissionForm) {
        submissionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!fileInput.files.length) {
                Swal.fire({
                    icon: 'error',
                    title: 'فایل مقاله را انتخاب کنید',
                    text: 'لطفاً فایل مقاله خود را آپلود نمایید',
                    confirmButtonText: 'باشه'
                });
                return;
            }

            if (!document.getElementById('agree-terms').checked) {
                Swal.fire({
                    icon: 'error',
                    title: 'قوانین را تأیید کنید',
                    text: 'برای ادامه باید با قوانین جشنواره موافقت کنید',
                    confirmButtonText: 'متوجه شدم'
                });
                return;
            }

            const formData = new FormData();
            formData.append('fullname', document.getElementById('fullname').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('phone', document.getElementById('phone').value);
            formData.append('university', document.getElementById('university').value);
            formData.append('article_title', document.getElementById('article-title').value);
            formData.append('article_field', document.getElementById('article-field').value);
            formData.append('article', fileInput.files[0]);

            try {
                // نمایش اسپینر
                Swal.fire({
                    title: 'در حال ارسال مقاله',
                    html: 'لطفاً منتظر بمانید...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // شبیه‌سازی ارسال به سرور
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // پیام موفقیت
                const trackingCode = Math.random().toString(36).substring(2, 10).toUpperCase();
                
                Swal.fire({
                    icon: 'success',
                    title: 'مقاله با موفقیت ارسال شد!',
                    html: `
                        <div class="text-right">
                            <p>کد رهگیری: <strong>${trackingCode}</strong></p>
                            <p class="mt-2 text-sm">می‌توانید وضعیت مقاله را از پنل کاربری پیگیری کنید</p>
                        </div>
                    `,
                    confirmButtonText: 'ورود به پنل کاربری',
                    showCancelButton: true,
                    cancelButtonText: 'بستن'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = 'dashboard.html';
                    }
                });
                
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'خطا در ارسال',
                    text: 'متأسفانه مشکلی در ارسال مقاله پیش آمد. لطفاً مجدداً تلاش کنید.',
                    confirmButtonText: 'متوجه شدم'
                });
            }
        });
    }
});