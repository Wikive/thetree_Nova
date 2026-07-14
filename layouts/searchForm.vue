<template>
    <form id="searchform" class="form-inline" @submit.prevent>
        <div class="input-group">
            <button type="button" name="random" value="랜덤" class="btn btn-secondary search-action search-random" aria-label="랜덤 문서" title="랜덤 문서" @click="onClickRandom"><nova-icon name="shuffle" /></button>
            <div class="input-search">
                <input type="search" name="q" placeholder="검색" accesskey="f" class="form-control" id="searchInput" autocomplete="off" v-on:input="searchText = $event.target.value" v-model="searchTextModel" @blur="blur" @focus="focus" @input="inputChange" @keydown.enter="keyEnter" @keydown.tab="keyEnter" @keydown.up="keyUp" @keydown.down="keyDown">
                <div v-if="show" class="v-autocomplete-list">
                    <div class="v-autocomplete-list-item" v-for="(item, i) in internalItems" @click="onClickItem(item)" v-bind:key="i" :class="{'v-autocomplete-item-active': i === cursor}" @mouseover="cursor = i">
                        <div>{{ item }}</div>
                    </div>
                </div>
            </div>
            <span class="input-group-btn">
              <button type="submit" name="fulltext" value="검색" class="btn btn-secondary search-action search-submit" aria-label="검색" title="검색" @click="onClickSearch"><nova-icon name="search" /></button>
              <button type="button" name="go" value="바로가기" class="btn btn-secondary search-action search-move" aria-label="바로가기" @click="onClickMove"><nova-icon name="arrowRight" /></button>
            </span>
        </div>
    </form>
</template>

<style scoped>
.v-autocomplete-list {
    position: absolute;
    z-index: 3;
    width: 10.8rem;
    border: 1px solid var(--border, #d8e1ec);
    background-color: var(--surface, #fff);
    box-shadow: var(--shadow, 0 12px 32px rgba(31, 41, 55, 0.08));
}

@media (max-width: 1023px) {
    .v-autocomplete-list {
        width: 100%;
    }
}

.v-autocomplete-list-item {
    cursor: pointer;
    color: var(--text, #1f2937);
    padding: 0.5rem;
    word-break: break-all;
}

.v-autocomplete-list-item.v-autocomplete-item-active {
    background-color: color-mix(in srgb, var(--brand, #006cf0) 12%, var(--surface, #fff));
}
</style>

<script>
import AutocompleteMixin from '~/mixins/autocomplete';
import Common from '~/mixins/common';
import NovaIcon from '../components/NovaIcon';

export default {
    components: { NovaIcon },
    mixins: [AutocompleteMixin],
    methods: {
        onClickSearch() {
            if (!this.searchText) return;
            this.$router.push('/Search?q=' + encodeURIComponent(this.searchText));
        },
        onClickMove() {
            if (!this.searchText) return;
            this.$router.push(Common.methods.doc_action_link(this.searchText, 'w'));
        },
        onClickRandom() {
            this.$router.push('/RandomPage');
        }
    },
    watch: {
        $route() {
            if ((this.$store.state.localConfig["nova.reset_search_on_move"] ?? true) !== false) this.reset();
        }
    }
}
</script>
