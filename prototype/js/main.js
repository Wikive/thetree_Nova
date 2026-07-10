(function () {
    'use strict';

    var root = document.documentElement;

    /* ---------- 다크모드 토글 (buma 방식: data-theme 속성) ---------- */
    var themeToggle = document.getElementById('themeToggle');
    var themeLabel = document.getElementById('themeToggleLabel');

    function applyTheme(theme) {
        root.dataset.theme = theme;
        localStorage.setItem('nova-skin-theme', theme);
        if (themeLabel) themeLabel.textContent = theme === 'dark' ? '라이트 테마로' : '다크 테마로';
    }

    var savedTheme = localStorage.getItem('nova-skin-theme') || 'light';
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
        });
    }

    /* ---------- 네브바 드롭다운 (liberty 방식: 도구/유저 메뉴) ---------- */
    var dropdownToggles = document.querySelectorAll('[data-dropdown]');
    function closeDropdowns() {
        document.querySelectorAll('.dropdown.is-open').forEach(function (d) {
            d.classList.remove('is-open');
            var toggle = d.querySelector('[data-dropdown]');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    }

    dropdownToggles.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var target = document.getElementById(btn.dataset.dropdown);
            var wasOpen = target.classList.contains('is-open');
            closeDropdowns();
            if (!wasOpen) {
                target.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
    document.addEventListener('click', closeDropdowns);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDropdowns();
    });

    /* ---------- 모바일 네브바 버거 (buma 방식) ---------- */
    var burger = document.getElementById('navbarBurger');
    var menu = document.getElementById('navbarMenu');
    burger.addEventListener('click', function () {
        var open = menu.classList.toggle('is-active');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    /* ---------- 모바일 사이드바 토글 (liberty의 footer 사이드바 모드 참고) ---------- */
    var sidebarToggle = document.getElementById('sidebarToggle');
    var sidebarSticky = document.getElementById('sidebarSticky');
    sidebarToggle.addEventListener('click', function () {
        var open = sidebarSticky.classList.toggle('is-open');
        sidebarToggle.textContent = open ? '최근 변경 접기 ▴' : '최근 변경 보기 ▾';
    });

    /* ---------- 최근 변경/토론 탭 ---------- */
    document.querySelectorAll('[data-recent-tab]').forEach(function (tab) {
        tab.addEventListener('click', function () {
            var key = tab.dataset.recentTab;
            document.querySelectorAll('[data-recent-tab]').forEach(function (item) {
                var active = item === tab;
                item.classList.toggle('active', active);
                item.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            document.querySelectorAll('[data-recent-panel]').forEach(function (panel) {
                panel.classList.toggle('is-hidden', panel.dataset.recentPanel !== key);
            });
        });
    });

    /* ---------- 알림 닫기 ---------- */
    document.querySelectorAll('.notification-close').forEach(function (btn) {
        btn.addEventListener('click', function () {
            btn.closest('.notification').remove();
        });
    });

    /* ---------- 브랜드 컬러 커스터마이징 (liberty의 darken/lighten 알고리즘 이식) ---------- */
    function darkenColor(hex, percent) {
        percent = percent || 40;
        var r = parseInt(hex.substring(1, 3), 16);
        var g = parseInt(hex.substring(3, 5), 16);
        var b = parseInt(hex.substring(5, 7), 16);
        r = Math.round(r * (1 - percent / 100));
        g = Math.round(g * (1 - percent / 100));
        b = Math.round(b * (1 - percent / 100));
        return toHex(r, g, b);
    }

    function lightenColor(hex, percent) {
        percent = percent || 40;
        var r = parseInt(hex.substring(1, 3), 16);
        var g = parseInt(hex.substring(3, 5), 16);
        var b = parseInt(hex.substring(5, 7), 16);
        r = Math.round(r + (255 - r) * (percent / 100));
        g = Math.round(g + (255 - g) * (percent / 100));
        b = Math.round(b + (255 - b) * (percent / 100));
        return toHex(r, g, b);
    }

    function toHex(r, g, b) {
        return '#' + [r, g, b].map(function (v) {
            var h = v.toString(16);
            return h.length < 2 ? '0' + h : h;
        }).join('');
    }

    function applyBrandColor(color) {
        root.style.setProperty('--brand', color);
        root.style.setProperty('--brand-dark', darkenColor(color, 30));
        root.style.setProperty('--brand-bright', lightenColor(color, 30));
        localStorage.setItem('nova-skin-brand', color);
        document.querySelectorAll('.swatch').forEach(function (sw) {
            sw.classList.toggle('is-active', sw.dataset.color === color);
        });
    }

    var savedBrand = localStorage.getItem('nova-skin-brand');
    if (savedBrand) applyBrandColor(savedBrand);

    document.querySelectorAll('.swatch').forEach(function (sw) {
        sw.addEventListener('click', function () {
            applyBrandColor(sw.dataset.color);
        });
    });
})();
