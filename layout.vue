<template>
    <div class="Liberty Nova" :class="{ 'nova-dark': $store.state.currentTheme === 'dark' }" :style="skinConfig">
        <div id="top" class="top-anchor"></div>
        <header class="navbar gnb" :class="{ 'navbar-fixed-top': fixedNavbar === true }">
            <div class="navbar-inner">
                <nuxt-link class="navbar-brand" :class="{ 'has-logo': navbarLogoImage }" to="/" :aria-label="navbarLogoText">
                    <span v-if="navbarLogoImage" class="brand-logo-image" aria-hidden="true"></span>
                    <span v-else class="brand-mark"><nova-icon name="leaf" /></span>
                    <span class="brand-text">{{ navbarLogoText }}</span>
                </nuxt-link>

                <div class="mobile-search">
                    <search-form />
                </div>

                <button class="navbar-burger" type="button" aria-label="메뉴 열기" :aria-expanded="mobileMenuOpen ? 'true' : 'false'" @click="toggleMobileMenu">
                    <nova-icon name="menu" />
                </button>

                <button v-if="sidebarMode !== 'hide'" type="button" class="mobile-side-toggle" :class="{ 'is-active': mobileSidebarOpen }" aria-label="최근 변경과 최근 토론 열기" :aria-expanded="mobileSidebarOpen ? 'true' : 'false'" @click="toggleMobileSidebar">
                    <nova-icon name="clock" />
                </button>

                <div v-if="mobileMenuOpen" class="mobile-nav-backdrop" @click="mobileMenuOpen = false"></div>
                <nav class="navbar-menu" :class="{ 'is-active': mobileMenuOpen }" aria-label="모바일 메뉴">
                    <div class="mobile-nav-panel-header">
                        <div class="mobile-panel-copy">
                            <strong class="mobile-panel-title"><nova-icon name="grid" />메뉴</strong>
                        </div>
                        <button type="button" aria-label="메뉴 닫기" @click="mobileMenuOpen = false"><nova-icon name="close" /></button>
                    </div>
                    <div class="navbar-start">
                        <nuxt-link class="navbar-item" to="/RecentChanges"><nova-icon name="clock" />최근 변경</nuxt-link>
                        <nuxt-link class="navbar-item" to="/RecentDiscuss"><nova-icon name="comment" />최근 토론</nuxt-link>
                        <dropdown>
                            <template #toggle>
                                <button class="navbar-item dropdown-toggle" type="button">
                                    <nova-icon name="grid" />특수 기능 <nova-icon name="chevronDown" class="chevron" />
                                </button>
                            </template>
                            <div class="dropdown-menu feature-dropdown" role="menu">
                                <div v-if="showAdminMenu" class="feature-switch" role="tablist" aria-label="기능 분류">
                                    <button type="button" :class="{ active: featurePanel === 'special' }" @click.stop.prevent="featurePanel = 'special'">특수 기능</button>
                                    <button type="button" :class="{ active: featurePanel === 'admin' }" @click.stop.prevent="featurePanel = 'admin'">관리 도구</button>
                                </div>
                                <transition :name="featurePanel === 'admin' ? 'feature-pane-forward' : 'feature-pane-back'" mode="out-in">
                                    <div v-if="featurePanel === 'special' || !showAdminMenu" key="special" class="feature-pane">
                                        <nuxt-link to="/Upload" class="dropdown-item"><nova-icon name="upload" />파일 올리기</nuxt-link>
                                        <div class="dropdown-divider"></div>
                                        <nuxt-link to="/NeededPages" class="dropdown-item"><nova-icon name="document" />작성이 필요한 문서</nuxt-link>
                                        <nuxt-link to="/OrphanedPages" class="dropdown-item"><nova-icon name="shuffle" />고립된 문서</nuxt-link>
                                        <nuxt-link to="/OrphanedCategories" class="dropdown-item"><nova-icon name="lock" />고립된 분류</nuxt-link>
                                        <nuxt-link to="/UncategorizedPages" class="dropdown-item"><nova-icon name="alert" />분류가 없는 문서</nuxt-link>
                                        <nuxt-link to="/OldPages" class="dropdown-item"><nova-icon name="hourglass" />편집된 지 오래된 문서</nuxt-link>
                                        <nuxt-link to="/ShortestPages" class="dropdown-item"><nova-icon name="sortAsc" />내용이 짧은 문서</nuxt-link>
                                        <nuxt-link to="/LongestPages" class="dropdown-item"><nova-icon name="sortDesc" />내용이 긴 문서</nuxt-link>
                                        <div class="dropdown-divider"></div>
                                        <nuxt-link to="/BlockHistory" class="dropdown-item"><nova-icon name="scissors" />차단 내역</nuxt-link>
                                        <nuxt-link to="/RandomPage" class="dropdown-item"><nova-icon name="shuffle" />RandomPage</nuxt-link>
                                        <nuxt-link to="/License" class="dropdown-item"><nova-icon name="copyright" />라이선스</nuxt-link>
                                    </div>
                                    <div v-else key="admin" class="feature-pane">
                                        <nuxt-link v-for="item in adminMenuItems" :key="item.to" :to="item.to" class="dropdown-item admin-feature">
                                            <nova-icon :name="item.icon" />{{ item.title }}
                                        </nuxt-link>
                                    </div>
                                </transition>
                            </div>
                        </dropdown>
                    </div>

                    <div class="navbar-end">
                        <search-form />
                        <div class="account-actions">
                            <dropdown class="notification-dropdown">
                            <template #toggle>
                                <button class="navbar-item notification-toggle" type="button" aria-label="알림">
                                    <nova-icon name="bell" />
                                    <span class="notification-label">알림</span>
                                    <span v-if="notificationCount" class="notification-badge">{{ notificationCount }}</span>
                                </button>
                            </template>
                            <div class="dropdown-menu dropdown-menu-right notification-menu" role="menu">
                                <div class="notification-menu-header">
                                    <strong>최근 알림</strong>
                                    <div class="notification-actions">
                                        <a v-if="isLoggedIn && notificationCount" href="#" @click.prevent="markAllNotificationsRead">모두 읽음</a>
                                        <nuxt-link v-if="isLoggedIn" to="/member/notifications">전체 보기</nuxt-link>
                                    </div>
                                </div>
                                <div v-if="notificationCount" class="notification-list">
                                    <nuxt-link v-for="item in $store.state.session.notifications" :key="item.uuid" :to="item.url || '/member/notifications'" class="notification-item">
                                        <span class="notification-icon" :class="notificationToneClass(item.type)"><nova-icon :name="notificationIconName(item.type)" /></span>
                                        <span class="notification-body">
                                            <strong>{{ notificationTitle(item) }}</strong>
                                            <span><local-date :date="item.createdAt" relative /></span>
                                        </span>
                                    </nuxt-link>
                                </div>
                                <div v-else class="notification-empty">
                                    <nova-icon name="bell" />
                                    <span>새 알림이 없습니다.</span>
                                </div>
                            </div>
                        </dropdown>
                            <dropdown class="user-dropdown">
                            <template #toggle>
                                <button class="navbar-item avatar-toggle" type="button" aria-label="사용자 메뉴">
                                    <img v-if="$store.state.session.gravatar_url" class="avatar profile-img" :src="$store.state.session.gravatar_url" alt="">
                                    <span v-else class="avatar"><nova-icon name="user" /></span>
                                    <span class="avatar-summary">
                                        <strong>{{ accountName }}</strong>
                                        <span>{{ accountDescription }}</span>
                                    </span>
                                </button>
                            </template>
                            <div class="dropdown-menu dropdown-menu-right login-dropdown-menu">
                                <div class="dropdown-header user-menu-header">
                                    <img v-if="$store.state.session.gravatar_url" class="dropdown-avatar" :src="$store.state.session.gravatar_url" alt="">
                                    <span v-else class="dropdown-avatar"><nova-icon name="user" /></span>
                                    <span class="user-menu-title"><strong>{{ accountName }}</strong><span class="muted">{{ accountDescription }}</span></span>
                                </div>
                                <div class="dropdown-divider"></div>
                                <a href="#" class="dropdown-item" @click.prevent="openSettingModal"><nova-icon name="sliders" />설정</a>
                                <a v-if="$store.state.currentTheme === 'light'" href="#" class="dropdown-item" @click.prevent="$store.commit('localConfigSetValue', {key: 'wiki.theme', value: 'dark'})"><nova-icon name="moon" />다크 테마로</a>
                                <a v-if="$store.state.currentTheme === 'dark'" href="#" class="dropdown-item" @click.prevent="$store.commit('localConfigSetValue', {key: 'wiki.theme', value: 'light'})"><nova-icon name="sun" />라이트 테마로</a>
                                <div class="dropdown-divider"></div>
                                <template v-if="$store.state.session.account.type === 1">
                                    <nuxt-link to="/member/mypage" class="dropdown-item"><nova-icon name="id" />내 정보</nuxt-link>
                                    <nuxt-link :to="doc_action_link(user_doc($store.state.session.account.name), 'w')" class="dropdown-item"><nova-icon name="user" />내 사용자 문서</nuxt-link>
                                    <nuxt-link to="/member/starred_documents" class="dropdown-item"><nova-icon name="star" />내 문서함</nuxt-link>
                                    <div class="dropdown-divider"></div>
                                </template>
                                <template v-if="$store.state.session.account.uuid">
                                    <nuxt-link class="dropdown-item" :to="contribution_link($store.state.session.account.uuid)"><nova-icon name="edit" />내 문서 기여 목록</nuxt-link>
                                    <nuxt-link class="dropdown-item" :to="contribution_link_discuss($store.state.session.account.uuid)"><nova-icon name="comment" />내 토론 기여 목록</nuxt-link>
                                    <nuxt-link class="dropdown-item" :to="contribution_link_edit_request($store.state.session.account.uuid)"><nova-icon name="check" />내 편집 요청 목록</nuxt-link>
                                    <div class="dropdown-divider"></div>
                                </template>
                                <nuxt-link v-if="$store.state.session.account.type === 1" :to="{path:'/member/logout',query:{redirect:$route.fullPath}}" class="dropdown-item"><nova-icon name="logout" />로그아웃</nuxt-link>
                                <nuxt-link v-else :to="{path:'/member/login',query:{redirect:$route.fullPath}}" class="dropdown-item"><nova-icon name="login" />로그인</nuxt-link>
                            </div>
                            </dropdown>
                        </div>
                    </div>
                </nav>
            </div>
        </header>

        <section class="hero doc-header" :class="heroClass" id="wikiHero">
            <div class="hero-inner doc-header-inner">
                <div class="breadcrumb doc-kind-label">
                    <span>{{ documentKindLabel }}</span>
                </div>
                <h1 class="hero-title" v-if="$store.state.page.data.document && $store.state.page.viewName !== 'error'">
                    <nuxt-link :to="doc_action_link($store.state.page.data.document, 'w')"><span v-if="$store.state.page.data.document.forceShowNamespace !== false" class="namespace">{{$store.state.page.data.document.namespace}}:</span>{{$store.state.page.data.document.title}}</nuxt-link>
                    <small v-if="normalizedPageStateSuffix" class="doc-state-chip">{{ normalizedPageStateSuffix }}</small>
                </h1>
                <h1 class="hero-title" v-else>{{ $store.state.page.title }}</h1>
                <div class="doc-meta" v-if="documentMetaItems.length || $store.state.page.data.date">
                    <span v-if="$store.state.page.data.date" class="doc-meta-chip updated-chip">
                        <nova-icon name="clock" />
                        <strong><local-date :date="$store.state.page.data.date" /></strong>
                    </span>
                    <template v-for="(item, index) in documentMetaItems" :key="item + index">
                        <span class="doc-meta-chip subtle-chip">{{ item }}</span>
                    </template>
                </div>
            </div>
        </section>

        <nav v-show="documentToolsVisible" class="document-tabs" :class="{ 'is-stuck': documentTabsStuck }" aria-label="문서 도구">
            <div class="container document-tabs-inner">
                <nuxt-link class="document-tabs-title" :to="documentTitleLink" :title="documentTabsTitle">
                    <nova-icon name="document" />
                    <span>{{ documentTabsTitle }}</span>
                </nuxt-link>
                <content-tool @onClickEditBtn="showEditMessage" @tools-state="documentToolsVisible = $event" />
            </div>
        </nav>

        <div class="nova-alert-stack" aria-live="polite">
            <div v-if="$store.state.config['wiki.sitenotice']" id="site-notice" class="nova-alert is-warning">
                <nova-icon name="bell" />
                <div class="nova-alert-body">
                    <strong>공지</strong>
                    <p v-html="$store.state.config['wiki.sitenotice']" @click="onDynamicContentClick($event)"></p>
                </div>
            </div>
            <div v-if="isShowACLMessage && $store.state.page.data.edit_acl_message" class="nova-alert is-danger">
                <nova-icon name="shield" />
                <div class="nova-alert-body">
                    <strong>권한 안내</strong>
                    <p><span v-html="$store.state.page.data.edit_acl_message" @click="onDynamicContentClick($event)"></span><span v-if="requestable"> 대신 <nuxt-link :to="doc_action_link($store.state.page.data.document, 'new_edit_request')">편집 요청</nuxt-link>을 생성할 수 있습니다.</span></p>
                </div>
                <button type="button" class="nova-alert-close" aria-label="닫기" @click="isShowACLMessage = false"><nova-icon name="close" /></button>
            </div>
            <div v-if="showUserDiscussNotice" class="nova-alert is-primary">
                <nova-icon name="comment" />
                <div class="nova-alert-body">
                    <strong>사용자 토론</strong>
                    <p>현재 진행 중인 <nuxt-link :to="doc_action_link(user_doc($store.state.session.account.name), 'discuss')">사용자 토론</nuxt-link>이 있습니다.</p>
                </div>
                <button type="button" class="nova-alert-close" aria-label="닫기" @click="$store.commit('localConfigSetValue', {key: 'wiki.hide_user_document_discuss', value: $store.state.session.user_document_discuss})"><nova-icon name="close" /></button>
            </div>
        </div>

        <div class="container layout-grid" :class="{ 'hide-sidebar': sidebarMode === 'hide' || sidebarMode === 'footer' }">
            <main class="content-column">
                <div class="liberty-content-main" :class="{ 'wiki-article': $store.state.page.viewName === 'wiki' }">
                    <alert v-if="$store.state.page.viewName === 'notfound' && $store.state.page.data.document.namespace === '문서'" style="line-height: 2.1rem;">
                        '{{ $store.state.page.title }}'을(를) 검색하시겠습니까?
                        <div class="float-right"><seed-link-button :to="'/Search?q='+ $store.state.page.title">검색</seed-link-button></div>
                        <div class="clearfix"></div>
                    </alert>
                    <nuxt />
                    <section v-if="$store.state.page.viewName === 'license'" class="skin-license-page wiki-license-page">
                        <h2>Nova Skin</h2>
                        <p>Nova Skin은 the tree용 위키 스킨입니다. 문서 도구, 검색, 최근 변경 목록 등 Liberty 계열 스킨의 흐름을 유지하면서 Nova 전용 레이아웃과 테마를 적용합니다.</p>
                        <h3>기반</h3>
                        <ul>
                            <li><a href="https://github.com/librewiki/liberty-skin" target="_blank" rel="noopener noreferrer">Liberty Skin</a></li>
                            <li><a href="https://github.com/namu-theseed/theseed-skin-liberty" target="_blank" rel="noopener noreferrer">theseed-skin-liberty</a> - the seed용 Liberty 구현</li>
                            <li><a href="https://github.com/wjdgustn/thetree-skin-liberty" target="_blank" rel="noopener noreferrer">thetree-skin-liberty</a> - the seed/the tree용 Liberty 구현</li>
                        </ul>
                        <h3>라이선스</h3>
                        <p>기반 프로젝트에서 가져온 코드와 자산은 각 원 프로젝트의 라이선스와 고지를 따릅니다. Nova에서 새로 작성된 변경 사항은 이 스킨 패키지의 일부로 제공됩니다.</p>
                    </section>
                    <div class="clearfix"></div>
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
                    <div v-if="tocItems.length" class="live-recent toc-card">
                        <div class="live-recent-header">
                            <a class="tab active" href="#wikiHero"><nova-icon name="list" />목차</a>
                        </div>
                        <nav class="toc-list" aria-label="문서 목차">
                            <nuxt-link v-for="item in tocItems" :key="item.id" class="recent-item" :to="`#${item.anchor}`" :class="`toc-level-${item.level}`">
                                <span v-if="item.num" class="recent-toc-num">{{ item.num }}.</span>
                                <span v-text="item.title"></span>
                            </nuxt-link>
                        </nav>
                    </div>
                    <div class="live-recent">
                        <div class="live-recent-header">
                            <nuxt-link class="tab active" to="/RecentChanges"><nova-icon name="clock" />최근 변경</nuxt-link>
                        </div>
                        <recent-card />
                        <div class="live-recent-footer">
                            <nuxt-link to="/RecentChanges" title="최근 변경내역">더 보기</nuxt-link>
                        </div>
                    </div>
                    <div class="live-recent live-discuss">
                        <div class="live-recent-header">
                            <nuxt-link class="tab active" to="/RecentDiscuss"><nova-icon name="comment" />최근 토론</nuxt-link>
                        </div>
                        <recent-card source="discuss" />
                        <div class="live-recent-footer">
                            <nuxt-link to="/RecentDiscuss" title="최근 토론">더 보기</nuxt-link>
                        </div>
                    </div>
                </div>
            </aside>
            <div v-if="$store.state.page.viewName === 'wiki' && $store.state.page.data.copyright_text" class="article-license" v-html="$store.state.page.data.copyright_text" />
            <div id="bottom" class="liberty-footer article-footer">
                <ul v-if="$store.state.page.viewName === 'wiki' && $store.state.page.data.date" class="footer-info">
                    <li v-if="$store.state.page.data.rev" class="footer-info-lastmod">이 리비전은 <local-date :date="$store.state.page.data.date" />에 편집되었습니다.</li>
                    <li v-else class="footer-info-lastmod">이 문서는 <local-date :date="$store.state.page.data.date" />에 마지막으로 편집되었습니다.</li>
                </ul>
                <ul class="footer-places footer-links" @click="onDynamicContentClick($event)" v-html="$store.state.config['skin.nova.footer_html'] || $store.state.config['wiki.footer_text']" />
                <div class="footer-powered">
                    <p class="footer-credit"><a href="https://github.com/Wikive/thetree_Nova" target="_blank" rel="noopener noreferrer">Nova Skin</a> runs on <a href="https://github.com/wjdgustn/thetree" target="_blank" rel="noopener noreferrer">the tree</a>.</p>
                </div>
            </div>
        </div>
        <div v-if="sidebarMode !== 'hide'" class="mobile-side-panel" :class="{ 'is-open': mobileSidebarOpen }" aria-label="모바일 사이드바">
            <div class="mobile-side-panel-header">
                <div class="mobile-panel-copy">
                    <strong class="mobile-panel-title"><nova-icon name="clock" />위키 활동</strong>
                </div>
                <button type="button" aria-label="닫기" @click="mobileSidebarOpen = false"><nova-icon name="close" /></button>
            </div>
            <div v-if="tocItems.length" class="live-recent toc-card">
                <div class="live-recent-header">
                    <a class="tab active" href="#wikiHero" @click="mobileSidebarOpen = false"><nova-icon name="list" />목차</a>
                </div>
                <nav class="toc-list" aria-label="문서 목차">
                    <nuxt-link v-for="item in tocItems" :key="item.id" class="recent-item" :to="`#${item.anchor}`" :class="`toc-level-${item.level}`" @click.native="mobileSidebarOpen = false">
                        <span v-if="item.num" class="recent-toc-num">{{ item.num }}.</span>
                        <span v-text="item.title"></span>
                    </nuxt-link>
                </nav>
            </div>
            <div class="live-recent">
                <div class="live-recent-header">
                    <nuxt-link class="tab active" to="/RecentChanges"><nova-icon name="clock" />최근 변경</nuxt-link>
                </div>
                <recent-card :limit="8" />
                <div class="live-recent-footer">
                    <nuxt-link to="/RecentChanges" title="최근 변경내역">더 보기</nuxt-link>
                </div>
            </div>
            <div class="live-recent live-discuss">
                <div class="live-recent-header">
                    <nuxt-link class="tab active" to="/RecentDiscuss"><nova-icon name="comment" />최근 토론</nuxt-link>
                </div>
                <recent-card source="discuss" :limit="8" />
                <div class="live-recent-footer">
                    <nuxt-link to="/RecentDiscuss" title="최근 토론">더 보기</nuxt-link>
                </div>
            </div>
        </div>
        <div v-if="mobileSidebarOpen" class="mobile-side-backdrop" @click="mobileSidebarOpen = false"></div>
        <div class="jump-buttons">
            <nuxt-link class="jump-btn scroll-toc" to="#wikiHero" title="목차로"><nova-icon name="list" /></nuxt-link>
            <nuxt-link id="left" class="jump-btn scroll-button" to="#top" title="맨 위로"><nova-icon name="arrowUp" /></nuxt-link>
            <nuxt-link id="right" class="jump-btn scroll-bottom" to="#bottom" title="맨 아래로"><nova-icon name="arrowDown" /></nuxt-link>
        </div>
    </div>
</template>
<style>
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
import NovaIcon from './components/NovaIcon';

export default {
    mixins: [Common],
    components: {
        Alert,
        SeedLinkButton,
        LocalDate,
        RecentCard,
        SearchForm,
        Dropdown,
        ContentTool,
        NovaIcon
    },
    data() {
        return {
            isShowACLMessage: false,
            mobileMenuOpen: false,
            documentToolsVisible: false,
            documentTabsStuck: false,
            mobileSidebarOpen: false,
            featurePanel: 'special',
            stickyScrollRaf: null
        };
    },
    watch: {
        $route() {
            this.isShowACLMessage = false;
            this.mobileMenuOpen = false;
            this.mobileSidebarOpen = false;
            this.featurePanel = 'special';
            this.documentTabsStuck = false;
            this.$nextTick(() => {
                this.resetDocumentTabsScroll();
                this.updateDocumentTabsStuck();
            });
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
                case 'edit_request': return '편집 요청';
                case 'edit':
                    if (body.section) return `r${body.baserev} 문단 편집`;
                    if (body.baserev === '0') return '새 문서 생성';
                    return body.baserev ? `r${body.baserev} 편집` : '편집';
                case 'history': return '역사';
                case 'backlink': return '역링크';
                case 'move': return '이동';
                case 'delete': return '삭제';
                case 'acl': return 'ACL';
                case 'thread': return '토론';
                case 'thread_list': return '토론 목록';
                case 'thread_list_close': return '닫힌 토론';
                case 'edit_request_close': return '닫힌 편집 요청';
                case 'diff': return '비교';
                case 'revert': return data.rev ? `r${data.rev}로 되돌리기` : '되돌리기';
                case 'raw': return data.rev ? `r${data.rev} RAW` : 'RAW';
                case 'blame': return data.rev ? `r${data.rev} Blame` : 'Blame';
                case 'wiki': return data.rev ? `r${data.rev} 판` : '';
                default: return '';
            }
        },
        normalizedPageStateSuffix() {
            return String(this.pageStateSuffix || '').replace(/^\((.*)\)$/, '$1');
        },
        accountName() {
            return this.$store.state.session.account.name || '익명 사용자';
        },
        accountInitial() {
            return (this.accountName || '익').charAt(0);
        },
        accountDescription() {
            return this.$store.state.session.account.type === 1 ? 'Member' : '로그인이 필요합니다';
        },
        documentKindLabel() {
            const page = this.$store.state.page;
            const document = page.data && page.data.document;
            if (page.viewName === 'error') return '오류';
            if (!document) return '특수 문서';
            if (!document.namespace || document.namespace === '문서') return '문서';
            return `${document.namespace} 문서`;
        },
        documentTabsTitle() {
            const document = this.$store.state.page.data && this.$store.state.page.data.document;
            if (!document) return this.$store.state.page.title || this.documentKindLabel;
            const namespace = document.forceShowNamespace !== false && document.namespace ? `${document.namespace}:` : '';
            return `${namespace}${document.title}`;
        },
        documentTitleLink() {
            const document = this.$store.state.page.data && this.$store.state.page.data.document;
            return document ? this.doc_action_link(document, 'w') : this.$route.fullPath;
        },
        documentBreadcrumb() {
            const document = this.$store.state.page.data.document;
            if (!document || this.$store.state.page.viewName === 'error') return [];
            const crumbs = [];
            if (document.namespace && document.namespace !== '문서') crumbs.push(document.namespace);
            const title = document.title || this.$store.state.page.title || '';
            const parts = title.split('/').filter(Boolean);
            if (parts.length > 1) crumbs.push(...parts.slice(0, -1));
            else if (!crumbs.length) crumbs.push(this.$store.state.config['wiki.site_name'] || '문서');
            return crumbs;
        },
        documentMetaItems() {
            return [];
        },
        documentRevisionLabel() {
            const data = this.$store.state.page.data;
            if (data.rev) return `r${data.rev}`;
            if (data.body && data.body.baserev) return `r${data.body.baserev}`;
            return '';
        },
        adminMenuItems() {
            const menus = this.$store.state.session.menus || [];
            const iconMap = {
                '/admin/grant': 'shield',
                '/admin/manage_account': 'users',
                '/admin/login_history': 'history',
                '/aclgroup': 'users',
                '/admin/batch_revert': 'undo',
                '/admin/audit_log': 'document',
                '/admin/config': 'gear',
                '/admin/developer': 'terminal'
            };
            return menus.map((menu, index) => {
                const to = menu.l || menu.to || menu.href;
                if (!to) return null;
                return {
                    to,
                    title: menu.t || menu.title || menu.name || to,
                    icon: iconMap[to] || iconMap[to.replace(/\/$/, '')] || (to.startsWith('/aclgroup') ? 'users' : to.startsWith('/admin/developer') ? 'terminal' : to.startsWith('/admin') ? 'gear' : 'grid'),
                    order: index
                };
            }).filter(Boolean);
        },
        showAdminMenu() {
            return this.adminMenuItems.length > 0;
        },
        brand_color() {
            return this.configValue(['skin.nova.brand_color'], '#006cf0');
        },
        sidebarMode() {
            return this.$store.state.localConfig['nova.sidebar'];
        },
        fixedNavbar() {
            return this.$store.state.localConfig['nova.fixed_navbar'];
        },
        navbarLogoText() {
            return this.$store.state.config['skin.nova.navbar_logo_text'] ?? 'Nova';
        },
        navbarLogoImage() {
            return this.$store.state.config['skin.nova.navbar_logo_image'];
        },
        skinConfig() {
            return {
                '--nova-brand-color': this.brand_color,
                '--nova-brand-dark-color': this.selectByTheme('color-mix(in srgb, var(--nova-brand-color) 76%, #002b52)', 'color-mix(in srgb, var(--nova-brand-color) 72%, #d9ecff)'),
                '--nova-brand-bright-color': this.selectByTheme('color-mix(in srgb, var(--nova-brand-color) 10%, #fff)', 'color-mix(in srgb, var(--nova-brand-color) 36%, #fff)'),
                '--nova-accent-color': this.selectByTheme('color-mix(in srgb, var(--nova-brand-color) 82%, #00a6a6)', 'color-mix(in srgb, var(--nova-brand-color) 62%, #fff)'),
                '--nova-warm-color': this.selectByTheme('color-mix(in srgb, var(--nova-brand-color) 82%, #00a6a6)', 'color-mix(in srgb, var(--nova-brand-color) 62%, #fff)'),
                '--nova-navbar-logo-image': this.cssUrl(this.navbarLogoImage),
                '--nova-navbar-logo-width': this.configValue(['skin.nova.navbar_logo_width'], '6.5rem'),
                '--text-color': this.selectByTheme('#1f2937', '#e6edf3'),
                '--article-background-color': 'transparent',
                '--nova-bg-color': this.selectByTheme('#f8fafc', '#0d1117'),
                '--nova-surface-color': this.selectByTheme('#fff', '#151b24'),
                '--nova-surface-soft-color': this.selectByTheme('#f8fbff', '#1b2430'),
                '--nova-border-color': this.selectByTheme('#d8e1ec', '#2b3643'),
                '--nova-muted-color': this.selectByTheme('#5f6b7a', '#a7b3c2'),
            };
        },
        requestable() {
            return this.$store.state.page.data.editable === true && this.$store.state.page.data.edit_acl_message && this.$store.state.page.viewName !== 'notfound';
        },
        showUserDiscussNotice() {
            return this.$store.state.session.user_document_discuss && this.$store.state.localConfig['wiki.hide_user_document_discuss'] !== this.$store.state.session.user_document_discuss;
        },
        isLoggedIn() {
            return this.$store.state.session.account.type === 1;
        },
        notificationCount() {
            const notifications = this.$store.state.session.notifications;
            return Array.isArray(notifications) ? notifications.length : 0;
        },
        headingItems() {
            const page = this.$store.state.page || {};
            const data = page.data || {};
            return data.headings || (data.body && data.body.headings) || (data.document && data.document.headings) || page.headings || [];
        },
        tocItems() {
            if (!Array.isArray(this.headingItems)) return [];
            return this.headingItems.map((item, index) => {
                const anchor = item && (item.anchor || item.id);
                const title = item && (item.title || item.text);
                const num = item && (item.num || item.number || '');
                if (!anchor || !title) return null;
                return {
                    id: anchor || `toc-${index}`,
                    anchor,
                    title,
                    num,
                    level: item.level || (String(num || '').split('.').filter(Boolean).length + 1) || 2
                };
            }).filter(Boolean).slice(0, 24);
        }
    },
    mounted() {
        this.$nextTick(this.updateDocumentTabsStuck);
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', this.onStickyScroll, { passive: true });
            window.addEventListener('resize', this.onStickyScroll, { passive: true });
        }
    },
    beforeDestroy() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('scroll', this.onStickyScroll);
            window.removeEventListener('resize', this.onStickyScroll);
            if (this.stickyScrollRaf) window.cancelAnimationFrame(this.stickyScrollRaf);
        }
    },
    methods: {
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
            if (this.mobileMenuOpen) this.mobileSidebarOpen = false;
        },
        toggleMobileSidebar() {
            this.mobileSidebarOpen = !this.mobileSidebarOpen;
            if (this.mobileSidebarOpen) this.mobileMenuOpen = false;
        },
        showEditMessage() {
            if (this.isShowACLMessage) {
                this.$router.push(this.doc_action_link(this.$store.state.page.data.document, this.requestable ? 'new_edit_request' : 'edit'));
            }
            else {
                this.isShowACLMessage = true;
            }
        },
        configValue(keys, fallback = null) {
            for (const key of keys) {
                const value = this.$store.state.config[key];
                if (value !== undefined && value !== null && value !== '') return value;
            }
            return fallback;
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
        },
        notificationIconName(type) {
            if (type === 0) return 'comment';
            if (type === 1) return 'user';
            if (type === 2) return 'bell';
            return 'info';
        },
        notificationToneClass(type) {
            if (type === 0) return 'is-discuss';
            if (type === 1) return 'is-mention';
            if (type === 2) return 'is-owner';
            return 'is-default';
        },
        notificationTitle(item) {
            if (!item) return '알림';
            if ((item.type === 0 || item.type === 1) && item.comment && item.comment.contentHtml) return this.removeHtmlTags(item.comment.contentHtml);
            if (item.type === 2 && item.data) return this.removeHtmlTags(String(item.data)).slice(0, 50);
            return '새 알림이 있습니다.';
        },
        async markAllNotificationsRead() {
            if (!this.isLoggedIn || !this.notificationCount) return;
            await this.internalRequestAndProcess('/member/notifications/read', { method: 'POST' });
        },
        onStickyScroll() {
            if (typeof window === 'undefined') return;
            if (this.stickyScrollRaf) return;
            this.stickyScrollRaf = window.requestAnimationFrame(() => {
                this.stickyScrollRaf = null;
                this.updateDocumentTabsStuck();
            });
        },
        resetDocumentTabsScroll() {
            if (!this.$el || !this.$el.querySelector || typeof window === 'undefined') return;
            if (!window.matchMedia || !window.matchMedia('(max-width: 1023px)').matches) return;
            const inner = this.$el.querySelector('.document-tabs-inner');
            if (inner && inner.scrollLeft !== 0) inner.scrollLeft = 0;
        },
        updateDocumentTabsStuck() {
            if (!this.$el || !this.$el.querySelector || typeof window === 'undefined') return;
            const tabs = this.$el.querySelector('.document-tabs');
            if (!tabs) {
                this.documentTabsStuck = false;
                return;
            }
            const top = this.fixedNavbar ? parseFloat(getComputedStyle(this.$el).getPropertyValue('--nav-height')) || 0 : 0;
            const rect = tabs.getBoundingClientRect();
            const nextStuck = window.pageYOffset > 0 && rect.top <= top + 1;
            if (nextStuck && !this.documentTabsStuck) this.resetDocumentTabsScroll();
            this.documentTabsStuck = nextStuck;
        },
    }
}
</script>
