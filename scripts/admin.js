document.addEventListener('DOMContentLoaded', function() {
    // مدیریت دانلود فایل‌ها
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filename = this.dataset.file;
            Swal.fire({
                title: 'در حال آماده‌سازی فایل',
                html: `فایل <strong>${filename}</strong> در حال دانلود است...`,
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                },
                willClose: () => {
                    // شبیه‌سازی دانلود
                    const link = document.createElement('a');
                    link.href = `uploads/${filename}`;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        });
    });
    
    // مدیریت جستجو
    const searchInput = document.getElementById('search-articles');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterArticles(searchTerm);
        });
    }
    
    // مدیریت فیلترها
    const statusFilter = document.getElementById('filter-status');
    const fieldFilter = document.getElementById('filter-field');
    
    if (statusFilter && fieldFilter) {
        statusFilter.addEventListener('change', applyFilters);
        fieldFilter.addEventListener('change', applyFilters);
    }
    
    function applyFilters() {
        const status = statusFilter.value;
        const field = fieldFilter.value;
        filterArticles('', status, field);
    }
    
    // تابع فیلتر کردن مقالات
    function filterArticles(searchTerm = '', status = 'all', field = 'all') {
        const rows = document.querySelectorAll('#articles-table-body tr');
        
        rows.forEach(row => {
            const title = row.cells[0].textContent.toLowerCase();
            const author = row.cells[1].textContent.toLowerCase();
            const rowStatus = row.cells[5].textContent.toLowerCase();
            const rowField = row.cells[3].textContent.toLowerCase();
            
            const matchesSearch = title.includes(searchTerm) || author.includes(searchTerm);
            const matchesStatus = status === 'all' || rowStatus.includes(status);
            const matchesField = field === 'all' || rowField.includes(field);
            
            if (matchesSearch && matchesStatus && matchesField) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
}); 