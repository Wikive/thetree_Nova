<template>
    <div class="live-recent-content" :class="$style['live-recent-content']">
        <ul class="live-recent-list" :class="$style['live-recent-list']" id="live-recent-list">
            <template v-if="items.length === 0">
                <li v-for="i in limit" :key="i"><span class="recent-item" :class="$style['recent-item']">&nbsp;</span></li>
            </template>
            <template v-else>
                <template v-for="(r,i) in items" :key="itemKey(r, i)">
                    <li v-if="i < limit">
                        <nuxt-link v-if="source === 'discuss'" class="recent-item" :class="$style['recent-item']" :to="discussLink(r)">
                            <span class="recent-title" :class="$style['recent-title']">{{ discussTitle(r) }}</span>
                            <span class="recent-time" :class="$style['recent-time']">{{ relativeTime(discussDate(r)) }}</span>
                        </nuxt-link>
                        <nuxt-link v-else class="recent-item" :class="[$style['recent-item'], { [$style.removed]: r.status === 'delete', 'removed': r.status === 'delete' }]" :to="doc_action_link(r.document, 'w')">
                            <span class="recent-title" :class="$style['recent-title']">{{ r.document }}</span>
                            <span class="recent-time" :class="$style['recent-time']">{{ relativeTime(r.date) }}</span>
                        </nuxt-link>
                    </li>
                </template>
            </template>
        </ul>
    </div>
</template>
<style module scoped>
.live-recent-content {
    background-color: var(--surface, #fff);
    border: 1px solid var(--border, #d8e1ec);
    border-top: 0;
}

.live-recent-content .live-recent-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.live-recent-content .live-recent-list li {
    border-bottom: 1px solid var(--border, #d8e1ec);
    padding: 0.35rem 0.65rem;
}

.live-recent-content .live-recent-list li:last-child {
    border-bottom: none;
}

.live-recent-content .live-recent-list .recent-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    font-size: 0.9rem;
    color: var(--text, #1f2937);
}

.live-recent-content .live-recent-list .recent-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 650;
}

.live-recent-content .live-recent-list .recent-time {
    flex: none;
    color: var(--text-muted, #5f6b7a);
    font-size: 0.78rem;
    font-weight: 600;
    white-space: nowrap;
}

.live-recent-content .live-recent-list .recent-item .new {
    font-size: 0.82rem;
    color: #d14b55;
}

.live-recent-content .live-recent-list .recent-item.removed {
    text-decoration: line-through;
}

.live-recent-content .live-recent-list .recent-item.removed:hover {
    text-decoration: underline;
}
</style>

<script>
import RecentCardMixin from '~/mixins/recentCard';
export default {
    mixins: [RecentCardMixin],
    props: {
        limit: {
            type: Number,
            default: 15
        },
        source: {
            type: String,
            default: 'document'
        }
    },
    computed: {
        items() {
            return this.source === 'discuss' ? this.discuss : this.recent;
        }
    },
    methods: {
        relativeTime(date) {
            const timestamp = Number(date) || 0;
            if (!timestamp) return '';
            const now = Math.floor((new Date()).getTime() / 1000);
            const diff = Math.max(0, now - timestamp);
            if (diff < 60) return '방금 전';
            if (diff < 3600) return Math.floor(diff / 60) + '분 전';
            if (diff < 86400) return Math.floor(diff / 3600) + '시간 전';
            if (diff < 2592000) return Math.floor(diff / 86400) + '일 전';
            if (diff < 31536000) return Math.floor(diff / 2592000) + '개월 전';
            return Math.floor(diff / 31536000) + '년 전';
        },
        itemKey(item, index) {
            return item.url || item.document || index;
        },
        discussTitle(item) {
            return item.topic || item.title || item.document || item.url;
        },
        discussDate(item) {
            return item.lastUpdatedAt || item.date || item.createdAt;
        },
        discussLink(item) {
            if (item.topic) return '/thread/' + item.url;
            if (item.url) return '/edit_request/' + item.url;
            return '/RecentDiscuss';
        }
    }
}
</script>