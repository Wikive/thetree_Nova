<template>
    <div class="Liberty Nova" :style="skinConfig">
        <div id="top" class="top-anchor"></div>
        <header class="navbar" :class="{ 'navbar-fixed-top': fixedNavbar === true }">
            <div class="navbar-inner">
                <nuxt-link class="navbar-brand" :class="{ 'has-logo': navbarLogoImage }" to="/" :aria-label="navbarLogoText">
                    <span v-if="navbarLogoImage" class="brand-logo-image" aria-hidden="true"></span>
                    <span v-else class="brand-mark">N</span>
                    <span class="brand-text">{{ navbarLogoText }}</span>
                </nuxt-link>

                <div class="mobile-search">
                    <search-form />
                </div>

                <button class="navbar-burger" type="button" aria-label="메뉴 열기" :aria-expanded="mobileMenuOpen ? 'true' : 'false'" @click="mobileMenuOpen = !mobileMenuOpen">
                    <span class="fa fa-bars"></span>
                </button>

                <nav class="navbar-menu" :class="{ 'is-active': mobileMenuOpen }">
                    <div class="navbar-start">
                        <nuxt-link class="navbar-item" to="/RecentChanges"><span class="fa fa-refresh"></span>최근 변경</nuxt-link>
                        <nuxt-link class="navbar-item" to="/RecentDiscuss"><span class="fa fa-comments"></span>최근 토론</nuxt-link>
                        <dropdown>
                            <template #toggle>
                                <button class="navbar-item dropdown-toggle" type="button">
                                    <span class="fa fa-gear"></span>도구 <span class="fa fa-angle-down chevron" aria-hidden="true"></span>
                                </button>
                            </template>
                            <div class="dropdown-menu" role="menu">
                                <nuxt-link to="/Upload" class="dropdown-item">파일 올리기</nuxt-link>
                                <div class="dropdown-divider"></div>
                                <nuxt-link to="/NeededPages" class="dropdown-item">작성이 필요한 문서</nuxt-link>
                                <nuxt-link to="/OrphanedPages" class="dropdown-item">고립된 문서</nuxt-link>
                                <nuxt-link to="/OrphanedCategories" class="dropdown-item">고립된 분류</nuxt-link>
                                <nuxt-link to="/UncategorizedPages" class="dropdown-item">분류가 되지 않은 문서</nuxt-link>
                                <nuxt-link to="/OldPages" class="dropdown-item">편집된 지 오래된 문서</nuxt-link>
                                <nuxt-link to="/ShortestPages" class="dropdown-item">내용이 짧은 문서</nuxt-link>
                                <nuxt-link to="/LongestPages" class="dropdown-item">내용이 긴 문서</nuxt-link>
                                <div class="dropdown-divider"></div>
                                <nuxt-link to="/BlockHistory" class="dropdown-item">차단 내역</nuxt-link>
                                <nuxt-link to="/RandomPage" class="dropdown-item">RandomPage</nuxt-link>
                                <nuxt-link to="/License" class="dropdown-item">라이선스</nuxt-link>
                                <template v-if="$store.state.session.menus.length">
                                    <div class="dropdown-divider"></div>
                                    <nuxt-link v-for="m in $store.state.session.menus" :key="m.l" :to="m.l" class="dropdown-item">{{ m.t }}</nuxt-link>
                                </template>
                            </div>
                        </dropdown>
                    </div>

                    <div class="navbar-end">
                        <search-form />
                        <dropdown class="user-dropdown">
                            <template #toggle>
                                <button class="navbar-item avatar-toggle" type="button" aria-label="사용자 메뉴">
                                    <img v-if="$store.state.session.gravatar_url" class="avatar profile-img" :src="$store.state.session.gravatar_url" alt="">
                                    <span v-else class="avatar"><span class="fa fa-user"></span></span>
                                </button>
                            </template>
                            <div class="dropdown-menu dropdown-menu-right login-dropdown-menu">
                                <div class="dropdown-header">
                                    <strong>{{ accountName }}</strong><br><span class="muted">{{ accountDescription }}</span>
                                </div>
                                <div class="dropdown-divider"></div>
                                <a href="#" class="dropdown-item" @click.prevent="openSettingModal">설정</a>
                                <a v-if="$store.state.currentTheme === 'light'" href="#" class="dropdown-item" @click.prevent="$store.commit('localConfigSetValue', {key: 'wiki.theme', value: 'dark'})">다크 테마로</a>
                                <a v-if="$store.state.currentTheme === 'dark'" href="#" class="dropdown-item" @click.prevent="$store.commit('localConfigSetValue', {key: 'wiki.theme', value: 'light'})">라이트 테마로</a>
                                <div class="dropdown-divider"></div>
                                <template v-if="$store.state.session.account.type === 1">
                                    <nuxt-link to="/member/mypage" class="dropdown-item">내 정보</nuxt-link>
                                    <nuxt-link :to="doc_action_link(user_doc($store.state.session.account.name), 'w')" class="dropdown-item">내 사용자 문서</nuxt-link>
                                    <nuxt-link to="/member/starred_documents" class="dropdown-item">내 문서함</nuxt-link>
                                    <div class="dropdown-divider"></div>
                                </template>
                                <template v-if="$store.state.session.account.uuid">
                                    <nuxt-link class="dropdown-item" :to="contribution_link($store.state.session.account.uuid)">내 문서 기여 목록</nuxt-link>
                                    <nuxt-link class="dropdown-item" :to="contribution_link_discuss($store.state.session.account.uuid)">내 토론 기여 목록</nuxt-link>
                                    <nuxt-link class="dropdown-item" :to="contribution_link_edit_request($store.state.session.account.uuid)">내 편집 요청 목록</nuxt-link>
                                    <div class="dropdown-divider"></div>
                                </template>
                                <nuxt-link v-if="$store.state.session.account.type === 1" :to="{path:'/member/logout',query:{redirect:$route.fullPath}}" class="dropdown-item">로그아웃</nuxt-link>
                                <nuxt-link v-else :to="{path:'/member/login',query:{redirect:$route.fullPath}}" class="dropdown-item">로그인</nuxt-link>
                            </div>
                        </dropdown>
                    </div>
                </nav>
            </div>
        </header>

        <section class="hero" :class="heroClass" id="wikiHero">
            <div class="hero-inner">
                <h1 class="hero-title" v-if="$store.state.page.data.document && $store.state.page.viewName !== 'error'">
                    <nuxt-link :to="doc_action_link($store.state.page.data.document, 'w')"><span v-if="$store.state.page.data.document.forceShowNamespace !== false" class="namespace">{{$store.state.page.data.document.namespace}}:</span>{{$store.state.page.data.document.title}}</nuxt-link>
                    <small>{{ pageStateSuffix }}</small>
                </h1>
                <h1 class="hero-title" v-else>{{ $store.state.page.title }}</h1>
            </div>
        </section>

        <nav class="document-tabs" aria-label="문서 도구">
            <div class="container document-tabs-inner">
                <content-tool @onClickEditBtn="showEditMessage" />
            </div>
        </nav>

        <div class="container">
            <div v-if="$store.state.config['wiki.sitenotice']" id="site-notice" class="notification is-warning">
                <span v-html="$store.state.config['wiki.sitenotice']" @click="onDynamicContentClick($event)" />
            </div>
        </div>

        <div class="container layout-grid" :class="{ 'hide-sidebar': sidebarMode === 'hide' || sidebarMode === 'footer' }">
            <main class="content-column">
                <div class="liberty-content-main wiki-article">
                    <alert v-if="isShowACLMessage && $store.state.page.data.edit_acl_message" @close="isShowACLMessage = false" error closable>
                        <span v-html="$store.state.page.data.edit_acl_message" @click="onDynamicContentClick($event)"></span>
                        <span v-if="requestable"><br v-if="$store.state.page.data.edit_acl_message.includes('\n')"> 대신 <nuxt-link :to="doc_action_link($store.state.page.data.document, 'new_edit_request')">편집 요청</nuxt-link>을 생성할 수 있습니다.</span>
                    </alert>
                    <alert v-if="$store.state.session.user_document_discuss && $store.state.localConfig['wiki.hide_user_document_discuss'] !== $store.state.session.user_document_discuss" @close="$store.commit('localConfigSetValue', {key: 'wiki.hide_user_document_discuss', value: $store.state.session.user_document_discuss})" closable theme="primary">
                        현재 진행 중인 <nuxt-link :to="doc_action_link(user_doc($store.state.session.account.name), 'discuss')">사용자 토론</nuxt-link>이 있습니다.
                    </alert>
                    <alert v-if="$store.state.page.viewName === 'notfound' && $store.state.page.data.document.namespace === '문서'" style="line-height: 2.1rem;">
                        '{{ $store.state.page.title }}'을(를) 검색하시겠습니까?
                        <div class="float-right"><seed-link-button :to="'/Search?q='+ $store.state.page.title">검색</seed-link-button></div>
                        <div class="clearfix"></div>
                    </alert>
                    <nuxt />
                    <div v-if="$store.state.page.viewName === 'license'">
                        <h2>Nova Skin license</h2>
                        <pre>{{ License }}</pre>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div id="bottom" class="liberty-footer article-footer">
                    <ul v-if="$store.state.page.viewName === 'wiki' && $store.state.page.data.date" class="footer-info">
                        <li v-if="$store.state.page.data.rev" class="footer-info-lastmod">이 리비전은 <local-date :date="$store.state.page.data.date" />에 편집되었습니다.</li>
                        <li v-else class="footer-info-lastmod">이 문서는 <local-date :date="$store.state.page.data.date" />에 마지막으로 편집되었습니다.</li>
                        <li class="footer-info-copyright" v-html="$store.state.page.data.copyright_text" />
                    </ul>
                    <ul class="footer-places footer-links" @click="onDynamicContentClick($event)" v-html="$store.state.config['skin.nova.footer_html'] || $store.state.config['skin.liberty.footer_html'] || $store.state.config['wiki.footer_text']" />
                    <p class="footer-powered">
                        Nova Skin | based on <a href="//github.com/wjdgustn/thetree-skin-liberty" target="_blank">Liberty</a> | <a href="//github.com/wjdgustn/thetree" target="_blank">the tree</a>
                    </p>
                </div>
                <div v-if="sidebarMode === 'footer'" class="footer-recent live-recent">
                    <recent-card :limit="8" />
                    <div class="live-recent-footer">
                        <nuxt-link to="/RecentChanges" title="최근 변경내역">더 보기</nuxt-link>
                    </div>
                </div>
            </main>
            <aside class="sidebar-column" v-if="sidebarMode !== 'hide' && sidebarMode !== 'footer'">
                <div class="sidebar-sticky" :class="{ 'fixed': sidebarMode === 'fix' }">
                    <div class="live-recent">
                        <div class="live-recent-header">
                            <nuxt-link class="tab active" to="/RecentChanges">최근 변경</nuxt-link>
                        </div>
                        <recent-card />
                        <div class="live-recent-footer">
                            <nuxt-link to="/RecentChanges" title="최근 변경내역">더 보기</nuxt-link>
                        </div>
                    </div>
                    <div class="live-recent live-discuss">
                        <div class="live-recent-header">
                            <nuxt-link class="tab active" to="/RecentDiscuss">최근 토론</nuxt-link>
                        </div>
                        <recent-card source="discuss" />
                        <div class="live-recent-footer">
                            <nuxt-link to="/RecentDiscuss" title="최근 토론">더 보기</nuxt-link>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
        <div class="jump-buttons scroll-buttons">
            <nuxt-link class="jump-btn scroll-toc" to="#wikiHero" title="목차로"><i class="fa fa-list-alt" aria-hidden="true"></i></nuxt-link>
            <nuxt-link id="left" class="jump-btn scroll-button" to="#top" title="맨 위로"><i class="fa fa-arrow-up" aria-hidden="true"></i></nuxt-link>
            <nuxt-link id="right" class="jump-btn scroll-bottom" to="#bottom" title="맨 아래로"><i class="fa fa-arrow-down" aria-hidden="true"></i></nuxt-link>
        </div>
    </div>
</template>
<style>
@import "./css/bootstrap.min.css";
@import "./css/font-awesome.min.css";
@import "./css/font/Noto Sans KR.css";
@import "./css/default.css";
@import './css/default_mobile.css';
@import "./css/dark.css";
@import "./css/nova.css";
</style>

<script>
import Common from '~/mixins/common';
import Alert from '~/components/alert';
import SeedLinkButton from '~/components/seedLinkButton';
import LocalDate from '~/components/localDate';
import RecentCard from './layouts/recentCard';
import SearchForm from './layouts/searchForm';
import ContentTool from './layouts/contentTool';
import Dropdown from './components/dropdown';
import SettingModal from './components/settingModal';
import License from "raw-loader!./LICENSE";

export default {
    mixins: [Common],
    components: {
        Alert,
        SeedLinkButton,
        LocalDate,
        RecentCard,
        SearchForm,
        Dropdown,
        ContentTool
    },
    data() {
        return {
            License,
            isShowACLMessage: false,
            mobileMenuOpen: false
        };
    },
    watch: {
        $route() {
            this.isShowACLMessage = false;
            this.mobileMenuOpen = false;
        }
    },
    head() {
        return {
            meta: [{ name: 'theme-color', content: this.brand_color }]
        };
    },
    computed: {
        heroClass() {
            if (this.$store.state.page.viewName === 'notfound') return 'is-warning';
            if (this.$store.state.page.viewName === 'error') return 'is-danger';
            return 'is-primary';
        },
        pageStateSuffix() {
            const data = this.$store.state.page.data;
            const body = data.body || {};
            switch (this.$store.state.page.viewName) {
                case 'edit_edit_request':
                case 'edit_request': return '(편집 요청)';
                case 'edit':
                    if (body.section) return `(r${body.baserev} 문단 편집)`;
                    if (body.baserev === '0') return '(새 문서 생성)';
                    return body.baserev ? `(r${body.baserev} 편집)` : '(편집)';
                case 'history': return '(역사)';
                case 'backlink': return '(역링크)';
                case 'move': return '(이동)';
                case 'delete': return '(삭제)';
                case 'acl': return '(ACL)';
                case 'thread': return '(토론)';
                case 'thread_list': return '(토론 목록)';
                case 'thread_list_close': return '(닫힌 토론)';
                case 'edit_request_close': return '(닫힌 편집 요청)';
                case 'diff': return '(비교)';
                case 'revert': return data.rev ? `(r${data.rev}로 되돌리기)` : '(되돌리기)';
                case 'raw': return data.rev ? `(r${data.rev} RAW)` : '(RAW)';
                case 'blame': return data.rev ? `(r${data.rev} Blame)` : '(Blame)';
                case 'wiki': return data.rev ? `(r${data.rev} 판)` : '';
                default: return '';
            }
        },
        accountName() {
            return this.$store.state.session.account.name || '익명 사용자';
        },
        accountInitial() {
            return (this.accountName || '익').charAt(0);
        },
        accountDescription() {
            return this.$store.state.session.account.type === 1 ? 'Member' : '로그인 후 더 많은 기능을 이용하세요';
        },
        brand_color() {
            return this.selectByTheme(
                this.$store.state.config['skin.nova.brand_color_1'] ?? this.$store.state.config['skin.liberty.brand_color_1'] ?? '#7c3aed',
                this.$store.state.config['skin.nova.dark_brand_color_1'] ?? this.$store.state.config['skin.liberty.dark_brand_color_1'] ?? '#1b1d24'
            );
        },
        sidebarMode() {
            return this.$store.state.localConfig['nova.sidebar'] ?? this.$store.state.localConfig['liberty.sidebar'];
        },
        fixedNavbar() {
            return this.$store.state.localConfig['nova.fixed_navbar'] ?? this.$store.state.localConfig['liberty.fixed_navbar'];
        },
        navbarLogoText() {
            return this.$store.state.config['skin.nova.navbar_logo_text'] ?? this.$store.state.config['skin.liberty.navbar_logo_text'] ?? 'Nova';
        },
        navbarLogoImage() {
            return this.$store.state.config['skin.nova.navbar_logo_image'] || this.$store.state.config['skin.liberty.navbar_logo_image'] || this.$store.state.config['wiki.logo_url'];
        },
        skinConfig() {
            return {
                '--liberty-brand-color': this.brand_color,
                '--liberty-brand-dark-color': this.selectByTheme(this.$store.state.config['skin.nova.brand_dark_color_1'] ?? this.$store.state.config['skin.liberty.brand_dark_color_1'] ?? this.darkenColor(this.brand_color, 30), this.$store.state.config['skin.nova.dark_brand_dark_color_1'] ?? '#111217'),
                '--liberty-brand-bright-color': this.selectByTheme(this.$store.state.config['skin.nova.brand_bright_color_1'] ?? this.$store.state.config['skin.liberty.brand_bright_color_1'] ?? this.lightenColor(this.brand_color, 35), this.$store.state.config['skin.nova.dark_brand_bright_color_1'] ?? '#303443'),
                '--nova-accent-color': this.selectByTheme(this.$store.state.config['skin.nova.accent_color'] ?? '#22d3ee', this.$store.state.config['skin.nova.dark_accent_color'] ?? '#22d3ee'),
                '--nova-warm-color': this.selectByTheme(this.$store.state.config['skin.nova.warm_color'] ?? '#f97316', this.$store.state.config['skin.nova.dark_warm_color'] ?? '#fb923c'),
                '--liberty-navbar-logo-image': this.cssUrl(this.navbarLogoImage),
                '--liberty-navbar-logo-minimum-width': this.$store.state.config['skin.nova.navbar_logo_minimum_width'] ?? this.$store.state.config['skin.liberty.navbar_logo_minimum_width'],
                '--liberty-navbar-logo-width': this.$store.state.config['skin.nova.navbar_logo_width'] ?? this.$store.state.config['skin.liberty.navbar_logo_width'],
                '--liberty-navbar-logo-size': this.$store.state.config['skin.nova.navbar_logo_size'] ?? this.$store.state.config['skin.liberty.navbar_logo_size'],
                '--liberty-navbar-logo-padding': this.$store.state.config['skin.nova.navbar_logo_padding'] ?? this.$store.state.config['skin.liberty.navbar_logo_padding'],
                '--liberty-navbar-logo-margin': this.$store.state.config['skin.nova.navbar_logo_margin'] ?? this.$store.state.config['skin.liberty.navbar_logo_margin'],
                '--brand-color-1': 'var(--liberty-brand-color)',
                '--brand-color-2': this.selectByTheme(this.$store.state.config['skin.nova.brand_color_2'] ?? this.$store.state.config['skin.liberty.brand_color_2'] ?? 'var(--liberty-brand-color)', this.$store.state.config['skin.nova.dark_brand_color_2'] ?? 'var(--liberty-brand-color)'),
                '--brand-bright-color-1': 'var(--liberty-brand-bright-color)',
                '--brand-bright-color-2': this.selectByTheme(this.$store.state.config['skin.nova.brand_bright_color_2'] ?? this.$store.state.config['skin.liberty.brand_bright_color_2'] ?? 'var(--liberty-brand-bright-color)', this.$store.state.config['skin.nova.dark_brand_bright_color_2'] ?? 'var(--liberty-brand-bright-color)'),
                '--text-color': this.selectByTheme(this.$store.state.config['skin.nova.text_color'] ?? '#30343b', this.$store.state.config['skin.nova.dark_text_color'] ?? '#edf0f7'),
                '--article-background-color': this.selectByTheme(this.$store.state.config['skin.nova.article_background_color'] ?? '#fff', this.$store.state.config['skin.nova.dark_article_background_color'] ?? '#1b1d24'),
                '--nova-bg-color': this.selectByTheme(this.$store.state.config['skin.nova.background_color'] ?? '#f6f7fb', this.$store.state.config['skin.nova.dark_background_color'] ?? '#111217'),
                '--nova-surface-color': this.selectByTheme(this.$store.state.config['skin.nova.surface_color'] ?? '#fff', this.$store.state.config['skin.nova.dark_surface_color'] ?? '#1b1d24'),
                '--nova-surface-soft-color': this.selectByTheme(this.$store.state.config['skin.nova.surface_soft_color'] ?? '#fbfcff', this.$store.state.config['skin.nova.dark_surface_soft_color'] ?? '#151821'),
                '--nova-border-color': this.selectByTheme(this.$store.state.config['skin.nova.border_color'] ?? '#e3e7ef', this.$store.state.config['skin.nova.dark_border_color'] ?? '#303443'),
                '--nova-muted-color': this.selectByTheme(this.$store.state.config['skin.nova.muted_color'] ?? '#6b7280', this.$store.state.config['skin.nova.dark_muted_color'] ?? '#a4adbd'),
            };
        },
        requestable() {
            return this.$store.state.page.data.editable === true && this.$store.state.page.data.edit_acl_message && this.$store.state.page.viewName !== 'notfound';
        }
    },
    methods: {
        showEditMessage() {
            if (this.isShowACLMessage) {
                this.$router.push(this.doc_action_link(this.$store.state.page.data.document, this.requestable ? 'new_edit_request' : 'edit'));
            }
            else {
                this.isShowACLMessage = true;
            }
        },
        darkenColor(hex, percent=50) {
            let r = parseInt(hex.substring(1, 3), 16);
            let g = parseInt(hex.substring(3, 5), 16);
            let b = parseInt(hex.substring(5, 7), 16);

            r = Math.round(r * (1 - percent / 100));
            g = Math.round(g * (1 - percent / 100));
            b = Math.round(b * (1 - percent / 100));

            return "#" + ((r < 16 ? "0" : "") + r.toString(16)) + ((g < 16 ? "0" : "") + g.toString(16)) + ((b < 16 ? "0" : "") + b.toString(16));
        },
        lightenColor(hex, percent=50) {
            let r = parseInt(hex.substring(1, 3), 16);
            let g = parseInt(hex.substring(3, 5), 16);
            let b = parseInt(hex.substring(5, 7), 16);

            r = Math.round(r + (255 - r) * (percent / 100));
            g = Math.round(g + (255 - g) * (percent / 100));
            b = Math.round(b + (255 - b) * (percent / 100));

            return "#" + ((r < 16 ? "0" : "") + r.toString(16)) + ((g < 16 ? "0" : "") + g.toString(16)) + ((b < 16 ? "0" : "") + b.toString(16));
        },
        selectByTheme(light, dark) {
            return this.$store.state.currentTheme === 'dark' ? dark : light;
        },
        cssUrl(value) {
            if (!value) return null;
            if (/^url\(/.test(value)) return value;
            return `url(${value})`;
        },
        openSettingModal() {
            this.$vfm.show({ component: SettingModal });
        }
    }
}
</script>
