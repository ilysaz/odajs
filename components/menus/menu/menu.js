ODA({ is: 'oda-menu', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host {
            min-width: 100px;
            @apply --vertical;
            overflow: hidden;
            @apply --shadow;
        }
        :host > div {
            overflow-y: auto;
        }
        .row {
            align-items: center;
        }
        .header {
            @apply --header;
        }
    </style>
    <div class="vertical flex">
        <div style="overflow: hidden" ref="menuitems" ~for="items" ~if="!item.hidden" :selected="selectedItem && (item === selectedItem || item?.value === selectedItem)"  class="horizontal item no-flex" @tap.stop.prev="_tap" :item :not-group="!item.group" ~style="getStyle(item)">
            <div style="overflow: hidden" class="flex horizontal row" ~class="item.group?'header':'content'">
                <div style="overflow: hidden" ~is="getTemplate(item)" class="flex row horizontal" :icon-size :item></div>
                <oda-button ~if="item?.items?.length" icon="icons:arrow-drop-up:90" :item @tap.stop.prev="showSubMenu"></oda-button>
            </div>
        </div>
    </div>
    `,
    top: 0,
    props: {
        icon: '',
        title: '',
        showSubTitle: false,
        template: '',
        items: [],
        iconSize: 24,
        selectedItem: Object,
        focusedItem: {
            set(n) {
                if (n) {
                    if (this.root) this.root.focusedItem = n;
                    this.fire('ok');
                }
            }
        },
        closeAfterOk: true
    },
    observers: [
        function onItemsOrSelectedItemChanged(items, selectedItem) {
            if (!items || !selectedItem) return;

            const idx = items.findIndex(i => i.value === selectedItem)
            if (!~idx) return;

            this.$refs.menuitems[idx-3]?.scrollIntoView?.();
        }
    ],
    getStyle(item) {
        const s = {};
        if (item?.group) {
            s.position = 'sticky';
            s.top = '0px';
            s.zIndex = 1;
            s.fontSize = 'small';
            s.filter = 'invert(1)';
            s.opacity = '.8';
        }
        else {
            s.position = 'relative';
            s.top = this.top + 'px';
            s.zIndex = 0;
            s.fontSize = 'normal';
        }
        return s;
    },
    getTemplate(item) {
        return item.is || item.template || (!item.group && this.template) || 'oda-menu-template';
    },
    async showSubMenu(e) {
        e.stopPropagation();
        await ODA.showDropdown('oda-menu', { items: e.target.item.items, root: this, template: this.template, showSubTitle: this.showSubTitle }, { fadein: true, parent: e.target, align: 'right', title: (this.showSubTitle ? e.target.item.label : undefined) });
    },
    _tap(e) {
        let res = e.currentTarget.item;
        res?.tap && res.tap();
        this.focusedItem = res;
    }
})

ODA({ is: 'oda-menu-template', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host([focused]) {
            @apply --focused;
            @apply --active;
            overflow: hidden;
        }
        :host(:hover) {
            @apply --active;
        }
        :host(:hover) div > oda-icon {
            opacity: 1;
        }
        div > oda-icon {
            opacity: .8;
            align-items: center;
            padding: 9px 4px;
        }
        label {
            padding: 4px 8px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .icon-box {
            min-width: {{iconSize}}px;
            max-width: {{iconSize}}px;
        }
        {}
    </style>
    <div ~if="!item?.group" class="no-flex icon-box">
        <oda-icon class="header" :icon-size="Math.floor(iconSize * .7)" :icon="item?.icon" :sub-icon="item?.subIcon"></oda-icon>
    </div>
    <label class="flex" :title="item?.label">{{item.label}}</label>
    `,
    item: {},
})
