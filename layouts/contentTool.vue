<template>
    <div v-if="main.length" class="content-tools">
        <div class="btn-group">
            <template v-for="l in main" :key="l.to">
                <a v-if="l.onclick" @click.prevent="l.onclick" href="#" class="btn btn-secondary tools-btn" :class="l.class" v-tooltip="l.tooltip" v-html="l.html || toolHtml(l.title)"></a>
                <nuxt-link v-else :to="l.to" class="btn btn-secondary tools-btn" :class="l.class" v-tooltip="l.tooltip" v-html="l.html || toolHtml(l.title)"></nuxt-link>
            </template>
            <template v-if="menu.length">
                <dropdown class="btn btn-secondary tools-btn">
                    <template #toggle>
                        <div class="dropdown-toggle" v-html="iconHtml('ellipsis')"></div>
                    </template>
                    <div class="dropdown-menu dropdown-menu-right" role="menu">
                        <template v-for="m in menu" :key="m.to">
                            <a v-if="m.onclick" @click.prevent="m.onclick" href="#" class="dropdown-item" :class="m.class" v-html="m.html || toolHtml(m.title)"></a>
                            <nuxt-link v-else :to="m.to" class="dropdown-item" :class="m.class" v-html="m.html || toolHtml(m.title)"></nuxt-link>
                        </template>
                    </div>
                </dropdown>
            </template>
        </div>
    </div>
</template>

<style scoped>
.content-tools {
    padding-right: 1rem;
    padding-top: 1rem;
    float: right;
}

.content-tools .tools-btn {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
}

.content-tools .tools-btn:deep(.nova-icon-star) {
    color: var(--accent, #ffb02e);
    margin-right: 0.1em;
}

.content-tools .dropdown.btn.tools-btn {
    padding: 0;
}

.content-tools .dropdown-toggle {
    padding: 0.4rem 0.3rem;
    margin-left: -1px;
}

.content-tools .tools-btn:hover,
.content-tools .tools-btn:focus,
.content-tools .tools-btn:active {
    background-color: color-mix(in srgb, var(--brand, #006cf0) 10%, var(--surface, #fff));
    border-color: var(--border, #d8e1ec);
    color: var(--brand-dark, #004b91);
    outline: 0;
    transition: 0s;
}

.content-tools .tools-btn.btn-danger,
.content-tools .tools-btn.btn-danger:hover,
.content-tools .tools-btn.btn-danger:focus,
.content-tools .tools-btn.btn-danger:active {
    background-color: color-mix(in srgb, #d9534f 16%, var(--surface, #fff));
    border-color: color-mix(in srgb, #d9534f 45%, var(--border, #d8e1ec));
    color: #d9534f;
}

.content-tools .tools-btn.btn-discuss-progress {
    background-color: color-mix(in srgb, #20b486 16%, var(--surface, #fff));
    color: color-mix(in srgb, #20b486 70%, var(--text, #1f2937));
}

.content-tools .tools-btn.btn-discuss-progress:hover,
.content-tools .tools-btn.btn-discuss-progress:focus,
.content-tools .tools-btn.btn-discuss-progress:active {
    background-color: color-mix(in srgb, #20b486 24%, var(--surface, #fff));
}

.content-tools .tools-btn.btn-info {
    color: var(--brand-dark, #004b91);
    background-color: color-mix(in srgb, var(--brand, #006cf0) 10%, var(--surface, #fff));
    border-color: color-mix(in srgb, var(--brand, #006cf0) 28%, var(--border, #d8e1ec));
}

.content-tools .tools-btn.btn-info:hover,
.content-tools .tools-btn.btn-info:focus,
.content-tools .tools-btn.btn-info:active {
    background-color: color-mix(in srgb, var(--brand, #006cf0) 17%, var(--surface, #fff));
    border-color: color-mix(in srgb, var(--brand, #006cf0) 40%, var(--border, #d8e1ec));
}

.content-tools .dropdown-menu {
    top: auto;
}

.dropdown-item.admin {
    background-color: color-mix(in srgb, #d9534f 13%, var(--surface, #fff));
    color: #d9534f;
    border-top: 1px solid color-mix(in srgb, #d9534f 36%, var(--border, #d8e1ec));
}

.dropdown-item.admin:hover {
    background-color: color-mix(in srgb, #d9534f 22%, var(--surface, #fff));
}
</style>

<script>
import { vTooltip } from 'floating-vue';
import { toast } from "vue-sonner";
import Common from '~/mixins/common';
import dropdown from '../components/dropdown';

export default {
    directives: { tooltip: vTooltip },
    mixins: [Common],
    components: {
        dropdown
    },
    data() {
        return {
            main: [],
            menu: []
        }
    },
    computed: {
        data() {
            return this.$store.state.page.data;
        }
    },
    methods: {
        iconHtml(name) {
            const icons = {
                eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
                edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
                comment: '<path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-6a8 8 0 1 1 18-5Z"/>',
                history: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v6h6"/><path d="M12 7v5l4 2"/>',
                key: '<circle cx="8" cy="15" r="4"/><path d="M11 12 21 2M17 6l3 3"/>',
                link: '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
                arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
                arrowLeft: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
                trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/>',
                code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
                user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
                undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>',
                columns: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/>',
                lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
                star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>',
                copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
                ban: '<circle cx="12" cy="12" r="9"/><path d="m5.7 5.7 12.6 12.6"/>',
                ellipsis: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
                info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'
            };
            return `<svg class="nova-icon nova-icon-${name}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name] || icons.info}</svg>`;
        },
        toolHtml(title) {
            const icons = {
                '읽기': 'eye',
                '보기': 'eye',
                '편집': 'edit',
                '편집 요청': 'edit',
                '토론': 'comment',
                '역사': 'history',
                'ACL': 'key',
                '역링크': 'link',
                '이동': 'arrowRight',
                '삭제': 'trash',
                'RAW': 'code',
                'blame': 'user',
                '되돌리기': 'undo',
                '비교': 'columns',
                '사용자 문서': 'user',
                '이전 화면': 'arrowLeft',
                '기여 목록': 'edit',
                '사용자 차단': 'ban',
                '차단 내역': 'history',
                'UUID 복사': 'copy',
                '삭제된 사용자 문서': 'user'
            };
            const icon = icons[title] || 'info';
            return `${this.iconHtml(icon)}<span class="tools-label">${title}</span>`;
        },
        calculate() {
            const uuid = this.data?.uuid;
            this.main = [];
            this.menu = [];
            switch (this.$store.state.page.viewName) {
                case 'wiki':
                    if (this.data.date === null) {
                        this.main.push({
                            to: this.doc_action_link(this.data.document, 'backlink'),
                            title: "역링크"
                        });
                        this.main.push({
                            to: this.doc_action_link(this.data.document, 'acl') + '#namespace.read',
                            title: "ACL"
                        });
                        break;
                    }
                    else if (!uuid) {
                        this.main.push({
                            to: this.doc_action_link(this.data.document, 'w'),
                            class: 'tools-btn-active',
                            html: `${this.iconHtml('eye')}<span class="tools-label">읽기</span>`
                        });
                        if (this.data.starred) this.main.push({
                            to: this.doc_action_link(this.data.document, 'member/unstar'),
                            tooltip: "Unstar",
                            html: `${this.iconHtml('star')}<span class="star-count">${this.data.star_count}</span>`
                        });
                        else if (this.data.star_count >= 0) this.main.push({
                            to: this.doc_action_link(this.data.document, 'member/star'),
                            tooltip: "Star",
                            html: `${this.iconHtml('star')}<span class="star-count">${this.data.star_count}</span>`
                        });
                        this.main.push({
                            to: this.doc_action_link(this.data.document, 'backlink'),
                            title: "역링크"
                        });
                        this.main.push({
                            to: this.doc_action_link(this.data.document, 'discuss'),
                            class: this.data.discuss_progress ? 'btn-discuss-progress' : null,
                            title: "토론"
                        });
                        if (this.data.editable === true && this.data.edit_acl_message) this.main.push({
                            onclick: () => this.$emit('onClickEditBtn'),
                            html: `${this.iconHtml('edit')}<span class="tools-label">편집 요청</span>`
                        });
                        else if (this.data.editable === false && this.data.edit_acl_message) this.main.push({
                            onclick: () => this.$emit('onClickEditBtn'),
                            html: `${this.iconHtml('lock')}<span class="tools-label">편집</span>`
                        });
                        else this.main.push({
                            to: this.doc_action_link(this.data.document, 'edit'),
                            html: `${this.iconHtml('edit')}<span class="tools-label">편집</span>`
                        });
                        this.main.push({
                            to: this.doc_action_link(this.data.document, 'history', this.data.rev ? { from: this.data.rev } : undefined),
                            title: "역사"
                        });
                        this.main.push({
                            to: this.doc_action_link(this.data.document, 'acl'),
                            title: "ACL"
                        });
                        if (this.data.user) {
                            this.menu.push({
                                to: this.contribution_link(this.data.user.uuid),
                                title: "기여 목록"
                            });
                            if (this.$store.state.session.quick_block && (this.$store.state.localConfig['nova.admin_convenience'] ?? this.$store.state.localConfig['liberty.admin_convenience']) !== false) {
                                this.menu.push({
                                    class: 'admin',
                                    onclick: () => this.openQuickACLGroup({
                                        username: this.data.document.title,
                                        note: `${this.doc_fulltitle(this.data.document)} 긴급차단`
                                    }),
                                    title: "사용자 차단"
                                });
                                this.menu.push({
                                    class: 'admin',
                                    to: `/BlockHistory?query=${this.data.user.uuid}&target=text`,
                                    title: "차단 내역"
                                });
                                this.menu.push({
                                    class: 'admin',
                                    onclick: () => this.copyUuid(this.data.document.title, this.data.user.uuid),
                                    title: "UUID 복사"
                                });
                            }
                        }
                        break;
                    }
                case 'raw':
                case 'blame':
                case 'revert':
                case 'diff':
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'history', this.data.rev ? { from: this.data.rev } : undefined),
                        class: 'btn-info',
                        title: "역사"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'w', uuid ? { uuid } : undefined),
                        class: this.$store.state.page.viewName === 'wiki' ? 'tools-btn-active' : null,
                        html: `${this.iconHtml('eye')}<span class="tools-label">읽기</span>`
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'raw', uuid ? { uuid } : undefined),
                        class: this.$store.state.page.viewName === 'raw' ? 'disabled' : null,
                        title: "RAW"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'blame', uuid ? { uuid } : undefined),
                        class: this.$store.state.page.viewName === 'blame' ? 'disabled' : null,
                        title: "blame"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'revert', uuid ? { uuid } : undefined),
                        class: this.$store.state.page.viewName === 'revert' ? 'disabled' : null,
                        title: "되돌리기"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'diff', uuid ? { uuid } : undefined),
                        class: this.$store.state.page.viewName === 'diff' ? 'disabled' : null,
                        title: "비교"
                    });
                    break;
                case 'notfound':
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'w'),
                        class: 'tools-btn-active',
                        html: `${this.iconHtml('eye')}<span class="tools-label">읽기</span>`
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'backlink'),
                        title: "역링크"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'discuss'),
                        class: this.data.discuss_progress ? 'btn-discuss-progress' : null,
                        title: "토론"
                    });
                    if (this.data.edit_acl_message) this.main.push({
                        onclick: () => this.$emit('onClickEditBtn'),
                        html: `${this.iconHtml('lock')}<span class="tools-label">편집</span>`
                    });
                    else this.main.push({
                        to: this.doc_action_link(this.data.document, 'edit'),
                        html: `${this.iconHtml('edit')}<span class="tools-label">편집</span>`
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'history', this.data.rev ? { from: this.data.rev } : undefined),
                        title: "역사"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'acl'),
                        title: "ACL"
                    });
                    break;
                case 'edit':
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'edit'),
                        class: 'tools-btn-active',
                        html: `${this.iconHtml('edit')}<span class="tools-label">편집</span>`
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'move'),
                        title: "이동"
                    });
                    this.main.push({
                        class: "btn-danger",
                        to: this.doc_action_link(this.data.document, 'delete'),
                        title: "삭제"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'history'),
                        title: "역사"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'acl') + '#document.edit',
                        title: "ACL"
                    });
                    break;
                case 'edit_edit_request':
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'history'),
                        title: "역사"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'acl') + '#document.edit_request',
                        title: "ACL"
                    });
                    break;
                case 'history':
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'history'),
                        class: 'tools-btn-active',
                        title: "역사"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'discuss'),
                        title: "토론"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'edit'),
                        title: "편집"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'acl'),
                        title: "ACL"
                    });
                    break;
                case 'thread_list':
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'edit'),
                        title: "편집"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'acl') + '#document.create_thread',
                        title: "ACL"
                    });
                    break;
                case 'thread_list_close':
                case 'edit_request_close':
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'discuss'),
                        title: "토론"
                    });
                    break;
                case 'thread':
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'discuss'),
                        title: "토론"
                    });
                    this.main.push({
                        to: `/thread/${this.data.thread.url}/acl`,
                        title: "ACL"
                    });
                    break;
                case 'edit_request':
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'discuss'),
                        title: "토론"
                    });
                    this.main.push({
                        to: this.doc_action_link(this.data.document, 'acl') + '#document.edit',
                        title: "ACL"
                    });
                    break;
                case 'contribution':
                case 'contribution_discuss':
                case 'contribution_edit_request':
                    this.main.push({
                        to: this.data.account.type === 1 ? this.doc_action_link(this.user_doc(this.data.account.name), 'w') : '',
                        class: this.data.account.type === 1 ? '' : 'disabled',
                        title: "사용자 문서"
                    });
                    if (this.$store.state.session.quick_block && (this.$store.state.localConfig['nova.admin_convenience'] ?? this.$store.state.localConfig['liberty.admin_convenience']) !== false) {
                        if (this.data.account.type !== -1) this.menu.push({
                            class: 'admin',
                            onclick: () => this.openQuickACLGroup({
                                username: this.data.account.type === 1 ? "".concat(this.data.account.name) : undefined,
                                ip: this.data.account.type === 0 ? this.data.account.name + '/' + (this.data.account.name.indexOf('.') === -1 ? "128" : '32') : undefined,
                                note: '기여 목록 긴급차단'
                            }),
                            title: "사용자 차단"
                        });
                        if (this.data.account.type === -1 && this.data.account.uuid) this.menu.push({
                            to: this.doc_action_link('삭제된사용자:' + this.data.account.uuid, 'w'),
                            class: 'admin',
                            title: "삭제된 사용자 문서"
                        });
                        this.menu.push({
                            class: 'admin',
                            to: `/BlockHistory?query=${this.data.account.uuid}&target=text`,
                            title: "차단 내역"
                        });
                        this.menu.push({
                            class: 'admin',
                            onclick: () => this.copyUuid(this.data.account.name, this.data.account.uuid),
                            title: "UUID 복사"
                        });
                    }
                    break;
                case '':
                    if (this.$store.state.page.title === '오류') this.main.push({
                        onclick: () => this.$router.back(),
                        title: "이전 화면"
                    });
                    break;
            }
            if (this.data.menus) this.menu = this.menu.concat(this.data.menus);
            this.$emit('tools-state', this.main.length > 0 || this.menu.length > 0);
        },
        async copyUuid(name, uuid) {
            try {
                await navigator.clipboard.writeText(uuid);
                toast(`${name} 사용자의 UUID가 복사되었습니다.`);
            } catch {
                toast("복사하지 못했습니다.");
            }
        }
    },
    mounted() {
        this.calculate();
    },
    watch: {
        $route() {
            this.$nextTick(() => {
                this.calculate();
            });
        },
        '$store.state.localConfig'() {
            this.$nextTick(() => {
                this.calculate();
            });
        }
    }
}
</script>
