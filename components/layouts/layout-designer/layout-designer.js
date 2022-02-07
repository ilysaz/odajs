ODA({ is: 'oda-layout-designer',
    template: `
        <style>
            :host{
                overflow-x: hidden;
                overflow-y: auto;
                @apply --vertical;
            }
        </style>
        <oda-layout-designer-structure class="flex content" :layout style="flex:0;" :root-savekey></oda-layout-designer-structure>
        <div class="flex"></div>
    `,
    data: null,
    selection: [],
    dragInfo: {},
    props: {
        designMode: {
            default: false,
            set(n) {
                this.selection = [];
            }
        },
        keys: '',
        settings: {
            default: {},
            save: true
        }
    },
    get rootSavekey() {
        return this.data?.savekey || 'root';
    },
    get layout() {
        return this.data && new Layout(this.data, this.keys);
    },
    editTemplate: 'span',
    structureTemplate: 'oda-layout-designer-structure',
    async loadScript() {
        return this.settings;
    },
    async saveScript(layout, action) {
        const saveKey = layout.root?.saveKey;
        if (typeof this.settings !== 'object')
            this.settings = {};
        this.settings[saveKey] ||= [];
        if (!Array.isArray(this.settings[saveKey]))
            this.settings[saveKey] = [];
        this.settings[saveKey].push(action);
    },
    resetSettings() {
        const keys = this.keys;
        this.settings = {};
        this.keys = '...';
        this.keys = keys; 
    }
})

ODA({ is: 'oda-layout-designer-structure',
    template: /*html*/`
        <style>
            :host{
                @apply --horizontal;
                @apply --no-flex;
                overflow: visible;
                flex-wrap: wrap;
                justify-content: space-around;
                align-content: flex-start;
            }
            [selected] {
                background-color: var(--selection-background);
            }
        </style>
        <oda-layout-designer-container ~for="next in layout?.items" :layout="next" :icon-size :selected="designMode && selection.has(next)"></oda-layout-designer-container>
    `,
    props: {
        layout: null,
        rootSavekey: ''
    },
    iconSize: 32,
    observers: [
        async function execute(layout, settings) {
            if (layout) {
                console.log('rootSavekey ... ', this.rootSavekey)
                layout.saveKey = this.rootSavekey || (this.savekey + '_' + (layout.id || layout.name || ''));
                if (settings?.[layout.saveKey])
                    await this.layout.execute(settings[layout.saveKey]);
            }
        }
    ]
})

ODA({ is: 'oda-layout-designer-group', imports: '@oda/button',
    template: `
        <style>
            :host{
                @apply --horizontal;
                @apply --flex;
                height: 100%;
            }
            [focused]{
                @apply --content;
            }
            label, input {
                white-space: nowrap;
                text-overflow: ellipsis;
                font-weight: bold;
                padding: 4px;
            }
            oda-button{
                transform: scale(.7);
                padding: 0px;
            }
        </style>
        <div class="horizontal flex" style="flex-wrap: wrap;">
           <div @tap="ontap($event, item)" ~for="layout?.items" class="horizontal" style="align-items: center" ~style="{'box-shadow': hoverItem === item ? 'inset 4px 0 0 0 var(--success-color)' : ''}"
                    :draggable :focused="item === layout.$focused" @dragstart.stop="ondragstart($event, item)" @dragover.stop="ondragover($event, item)"
                    @dragleave.stop="ondragleave" @drop.stop="ondrop($event, item)">
                <label ~is="editTab===item ? 'input' : 'label'" class="flex" @dblclick="editTab=designMode ? item : undefined" ::value="item.label" @change="tabRename($event, item)">{{item?.label}}</label>
                <oda-button :icon-size ~if="designMode" icon="icons:close" @tap.stop="removeTab($event, item)"></oda-button>
            </div>
        </div>
        <oda-button :icon-size @tap.stop="addTab" ~if="designMode" icon="icons:add"></oda-button>
    `,
    // attached() {
    //     this.layout.$focused = this.layout.items[0];
    // },
    get draggable() {
        return this.layout && this.designMode ? 'true' : 'false';
    },
    hoverItem: undefined,
    editTab: undefined,
    addTab() {
        const tabID = getUUID();
        const blockID = getUUID();
        const action = { id: tabID, action: "addTab", props: { group: this.layout.id, tab: tabID, block: blockID } };
        this.layout.addTab(action, this.layout);
        this.saveScript(this.layout, action);
    },
    removeTab(e, item) {
        const action = { action: "removeTab", props: { group: this.layout.id, tab: item.id } };
        this.layout.removeTab(action, item);
        this.saveScript(this.layout, action);
    },
    ontap(e, item) {
        this.layout.$focused = item;
        if (this.designMode) {
            const action = { action: "selectTab", props: { group: this.layout.id, tab: item.id } };
            this.saveScript(this.layout, action);
        }
    },
    ondragstart(e, item) {
        e.stopPropagation();
        this.dragInfo.dragItem = item;
        this.dragInfo.isMoveTab = true;
    },
    ondragover(e, item) {
        e.stopPropagation();
        if (this.dragInfo.dragItem.root !== item.root || !this.dragInfo.isMoveTab) return;
        e.preventDefault();
        this.hoverItem = item;
    },
    ondragleave(e) {
        this.hoverItem = undefined;
    },
    ondrop(e, item) {
        e.stopPropagation();
        this.dragInfo.targetItem = item;
        this.dragInfo._action = { action: 'move', props: { item: this.dragInfo.dragItem.id, target: this.dragInfo.targetItem.id, to: 'left' } };
        this.layout.move(this.dragInfo);
        this.saveScript(this.layout, this.dragInfo._action);
        this.hoverItem = undefined;
        this.dragInfo.isMoveTab = false;
    },
    tabRename(e, item) {
        this.editTab = undefined;
        if (this.designMode) {
            const action = { action: "renameTab", label: item.label, props: { tab: item.id } };
            this.saveScript(this.layout, action)
        }
    }
})

ODA({ is: 'oda-layout-designer-group-structure',
    template: `
        <style>
            :host{
                @apply --horizontal;
                @apply --flex;
                min-height: 32px;
                min-width: 32px;
                /*@apply --header;*/
                padding: 4px;
                position: relative;
                margin-left: {{iconSize}}px !important;
                @apply --shadow;
            }

        </style>
        <oda-layout-designer-structure ~if="item === layout.$focused" class="flex" ~for="layout?.items" :layout="item"></oda-layout-designer-structure>
    `
})

ODA({ is: 'oda-layout-designer-container', imports: '@oda/icon, @oda/menu',
    template: /*html*/`
        <style>
            :host{
                box-sizing: border-box;
                @apply --vertical;
                overflow: hidden;
                @apply --flex;
                min-width: {{hasChildren?'100%':'32px'}};
                /* flex-grow: {{layout?.noFlex?'1':'100'}}; */
                flex: {{width?'0 0 auto':'1000000000000000000000000000000 1 auto'}};
                /* flex-basis: auto; */
                cursor: {{designMode ? 'pointer' : ''}};
                position: relative;
                order: {{layout?._order ?? 'unset'}};
                display: {{!designMode && (layout?.isHide || layout?.isVirtual) ? 'none' : 'unset'}};
            }
            label{
                font-size: small;
                font-weight: bold;
                padding: 8px;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .group{
                @apply --header;
            }
            [focused]{
                @apply --content;
            }
            .drag-to-left:after {
                box-shadow: inset 4px 0 0 0 var(--success-color);
            }
            .drag-to-right:after {
                box-shadow: inset -4px 0 0 0 var(--success-color);
            }
            .drag-to-top:after {
                box-shadow: inset 0 4px 0 0 var(--success-color);
            }
            .drag-to-bottom:after {
                box-shadow: inset 0 -4px 0 0 var(--success-color);
            }
            .drag-to:after {
                text-align: center;
                font-size: smaller;
                font-weight: bolder;
                content: attr(capture);
                pointer-events: none;
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0,255,0,.3);
            }
            .drag-to-error:after {
                content: "";
                pointer-events: none;
                background-color: rgba(255,0,0,.3) !important;
            }
        </style>
        <div ~if="designMode" ~is="designMode?'style':'div'">
            :host{
                outline: 1px dashed lightblue;
            }
        </div>
        <div ~if="designMode && layout?.isVirtual" ~is="designMode?'style':'div'">
            :host{
                outline: 1px dashed blue;
            }
        </div>
        <div ~if="designMode && layout?.isHide" ~is="designMode?'style':'div'">
            :host{
                outline: 1px dashed red;
            }
        </div>
        <div class="horizontal flex" style="align-items: end; overflow: hidden" @pointerdown="onpointerdown" :draggable
                ~class="{'drag-to':layout?.dragTo, [layout?.dragTo]:layout?.dragTo}">
            <oda-icon style="cursor: pointer;" :icon-size :icon="hasChildren?(layout?.$expanded?'icons:chevron-right:90':'icons:chevron-right'):''" @pointerdown.stop @tap.stop="expand()"></oda-icon>
            <div class="vertical flex" style="overflow: hidden;"  :disabled="designMode && !layout?.isGroup" 
                    ~class="{group:layout.isGroup}" 
                    ~style="{alignItems: (width && !layout?.type)?'center':''}">
<!--            <div class="vertical flex" style="overflow: hidden;"  :disabled="designMode && !layout?.isGroup" ~class="{group:layout.isGroup}" ~style="{flexDirection: labelPos==='top'?'column':'row', textAlign:  labelPos ==='top'?'start':'end'}">-->
                <label ~if="showLabel" class="no-flex">{{layout?.label}}</label>
                <div class="flex" ~is="layout?.$template || editTemplate" :layout ::width></div>
            </div>
        </div>
        <div ~if="hasChildren && layout?.$expanded" ~is="layout?.$structure || structureTemplate" :layout class="flex structure" style="margin-bottom: 16px; margin-right: 1px; border-left: 1px dashed white;" ~style="{marginLeft: iconSize/2+'px', paddingLeft: iconSize/2+'px'}"></div>
    `,
    width: undefined,
    get hasChildren() {
        return this.layout?.items?.length;
    },
    expand() {
        this.layout && (this.layout.$expanded = !this.layout.$expanded);
        if (this.designMode) {
            const action = { action: "expanded", props: { target: this.layout.id, value: this.layout.$expanded } };
            this.saveScript(this.layout, action)
        }
    },
    listeners: {
        async contextmenu(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!this.designMode) return;
            const res = await ODA.showDropdown('oda-menu', {
                items: [{
                    label: 'grouping', run: () => {
                        const action = { groupId: getUUID(), id: getUUID(), action: "toGroup", props: { target: this.layout.id, block: getUUID() } };
                        this.layout.toGroup(action);
                        this.saveScript(this.layout, action)
                    }
                }, { label: 'hide / unhide', run: () => {
                        this.layout.isHide = !this.layout.isHide;
                        const action = { action: "hide", hide: this.layout.isHide, props: { target: this.layout.id } };
                        this.saveScript(this.layout, action)
                    }
                }]
            }, { title: e.target.layout?.label });
            res.focusedItem.run.call(this)
        },
        'dragstart': 'ondragstart',
        'dragend': 'ondragend',
        'dragover': 'ondragover',
        'dragleave': 'ondragleave',
        'drop': 'ondragdrop',
    },
    labelPos: 'top',
    get showLabel() {
        return !this.layout.isGroup;
    },
    layout: null,
    get draggable() {
        return this.layout && this.designMode && !this.layout.isVirtual ? 'true' : 'false';
    },
    onpointerdown(e) {
        if (e.ctrlKey || e.metaKey)
            this.selection ||= [];
        else
            this.selection = [];
        if (this.selection?.[0] && this.selection[0].root !== this.layout.root) return;
        this.selection.add(this.layout);
    },
    ondragstart(e) {
        e.stopPropagation();
        this.dragInfo.isMoveTab  = false;
        this.dragInfo.dragItem = this.layout;
        e.dataTransfer.setDragImage((this.selection && this.selection.includes(this.dragInfo.dragItem) && this.selection.length) > 1 ? img3 : img, -20, 7);
    },
    ondragend(e) {
        this.clearDragTo();
    },
    ondragover(e) {
        e.stopPropagation();
        this.clearDragTo();
        if (this.dragInfo?.dragItem && !this.dragInfo.isMoveTab) {
            this.layout.dragTo = 'drag-to-error';
            if (this.dragInfo.dragItem.root !== this.layout.root || this.dragInfo.dragItem === this.layout) return;
            this.clearDragTo();
            e.preventDefault();
            let to = '',
                x = e.layerX,
                w = e.target.offsetWidth;
            x = (x - w / 2) / w * 2;
            // let y = e.layerY,
            //     h = e.target.offsetHeight;
            // y = (y - h / 2) / h * 2;
            // if (Math.abs(x) > Math.abs(y))
            to = x < 0 ? 'left' : 'right';
            // else
            //     to = y < 0 ? 'top' : 'bottom';
            this.dragInfo.to = to;
            this.layout.dragTo = 'drag-to-' + to;
            this.dragInfo.targetItem = this.layout;
        }
    },
    ondragleave(e) {
        this.clearDragTo();
    },
    ondragdrop(e) {
        e.stopPropagation();
        this.dragInfo._action = { action: 'move', props: { item: this.dragInfo.dragItem.id, target: this.dragInfo.targetItem.id, to: this.dragInfo.to } };
        this.layout.move(this.dragInfo);
        this.saveScript(this.layout, this.dragInfo._action);
        this.clearDragTo();
    },
    clearDragTo() {
        this.capture = this.layout.dragTo = '';
        let owner = this.layout.owner;
        while (owner) {
            owner.dragTo = '';
            owner.items?.forEach(i => i.dragTo = '');
            owner = owner.owner;
        }
        this.render();
    }
})
CLASS({ is: 'Layout',
    ctor(data, key = 'items', owner, root, order) {
        this.data = data || {};
        // this.saveKey = data.saveKey || data.$class?.id || undefined;
        this.key = key;
        this.owner = owner;
        this.order = this._order = order || 0;
        this._root = root;
    },
    owner: undefined,
    type: undefined,
    $expanded: false,
    get root() { return this._root || this.owner || this },
    set root(v) { this._root = v },
    get items() {
        const items = this.data?.[this.key];
        if (items?.then) {
            return items.then(items => {
                this.items = items.map((i, idx) => new Layout(i, this.key, this, this, idx + 1))
            })
        }
        return this.items = items?.map((i, idx) => new Layout(i, this.key, this, this, idx + 1))
    },
    get id() {
        return this.data?.id || this.data?.name || 'root';
    },
    get name() {
        return this.data?.name || this.id;
    },
    get label() {
        return this.data?.label || this.name;
    },
    get $template() {
        return this.isGroup ? 'oda-layout-designer-group' : '';
    },
    get $structure() {
        return this.isGroup ? 'oda-layout-designer-group-structure' : '';
    },
    get isGroup() {
        return this.type === "group";
    },
    async toGroup(action) {
        const item = action ? await this.find(action.props.target) : this;
        if (!item) return;
        const myIdx = item.owner.items.indexOf(item);
        const group = new Layout({ id: action.groupId, label: `Group ${action.groupId}` }, item.key, item.owner, item.root);
        const tab = new Layout({ id: action.id, label: `Tab 1` }, item.key, group, item.root);
        group.type = 'group';
        group.width = 0;
        group.items = [tab];
        group.$expanded = true;
        group.$focused = tab;
        group.order = item.order;
        group._order = item._order;
        tab.items = [item];
        tab.order = tab._order = 0;
        tab.type = 'tab';
        tab.blockID = action.props.block;
        item.owner.items.splice(myIdx, 1, group);
        item.owner = tab;
    },
    async addTab(action, layout) {
        const group = layout || await this.find(action.props.group);
        if (!group) return;
        const tab = new Layout({ id: action.id, label: `Tab ${group.items.length + 1}` }, group.key, group, group.root);
        tab.type = 'tab';
        group.items.push(tab)
        group.$focused = tab;
        const block = new Layout({ label: ` ` }, group.key, tab, group.root);
        block.isVirtual = true;
        tab.blockID = block.id = action.props.block;
        tab.items = [block];
        tab.order = tab._order = group.items.length
    },
    async removeTab(action, layout) {
        const group = layout ? this : await this.find(action.props.group);
        const tab = layout || await this.find(action.props.tab);
        if (!group || !tab) return;
        tab.root.items.splice(tab.owner.items.indexOf(group), 0, ...tab.items.filter(i => {
            i.owner = i.root;
            i._order = i.order;
            if (!i.isVirtual) return i;
        }));
        group.items.splice(group.items.indexOf(tab), 1);
        if (group.items.length === 0) {
            group.owner.items.splice(group.owner.items.indexOf(group), 1);
        }
    },
    async selectTab(action, layout) {
        const group = layout ? this : await this.find(action.props.group);
        const tab = layout || await this.find(action.props.tab);
        if (!group || !tab) return;
        group.$focused = tab;
    },
    async renameTab(action, layout) {
        const tab = layout || await this.find(action.props.tab);
        if (!tab) return;
        tab.label = action.label;
    },
    async hide(action, layout) {
        const item = layout || await this.find(action.props.target);
        if (!item) return;
        item.isHide = action.hide;
    },
    async move(dragInfo) {
        const action = dragInfo?._action || dragInfo;
        const dragItem = dragInfo.dragItem || await this.find(action.props.item);
        const targItem = dragInfo.targetItem || await this.find(action.props.target);
        if (!dragItem || !targItem) return;
        let idxTarg = targItem._order;
        dragItem._order = idxTarg = action.props.to === 'left' ? idxTarg - .1 : idxTarg + .1;
        if (targItem.owner !== targItem.root || dragItem.owner !== dragItem.root) {
            const idxDrag = dragItem.owner.items.indexOf(dragItem);
            const drag = dragItem.owner.items.splice(idxDrag, 1)[0];
            if (dragItem.owner.type === 'tab' && !dragItem.owner.items.length) {
                const block = new Layout({ label: ` ` }, dragItem.key, dragItem.owner, dragItem.root);
                block.isVirtual = true;
                block.id = dragItem.blockID;
                dragItem.owner.items = [block];
            }
            targItem.owner.items.splice(idxTarg, 0, drag);
            drag.owner = targItem.owner;
        }
        targItem.owner.items.sort((a, b) => a._order - b._order).map((i, idx) => {
            i._order = idx - .1 <= idxTarg ? idx : idx + 1;
        });
        if (targItem.isVirtual) {
            idxTarg = targItem.owner.items.indexOf(targItem);
            targItem.owner.items.splice(idxTarg, 1);
        }
    },
    async expanded(action) {
        const item = await this.find(action?.props?.target);
        if (item)
            item.$expanded = action.props.value;
    },
    async execute(actions) {
        if (!actions || !Array.isArray(actions)) return;
        for (const i of actions)
            await this[i.action]?.(i);
    },
    async find(id, item = this.root) {
        let items = await item.items;
        items = item.items;
        if (!items?.length) return;
        return items.reduce(async (res, i) => {
            if ((i.id + '') === (id + '')) res = i;
            return await res || this.find(id, i);
        }, undefined);
    }
})

const getUUID = function b(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) };
const img = new Image();
img.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQCAYAAABQrvyxAAAACXBIWXMAAAsSAAALEgHS3X78AAAAa0lEQVRIiWPU6v91RFv4jwIv+78/DEMIfP7JxHL1LcsDFpDjJ7p8kB5KjoeB/D0CDExDLeSRAcjtTIPHOeSBUQ8MNBj1wECDUQ8MNBj1wECDUQ8MNGACteqGquNBbgc3SUGtuiHZnH7L8gAAtichl6hs6rYAAAAASUVORK5CYII=`;
const img3 = new Image();
img3.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAUCAYAAADC1B7dAAAACXBIWXMAAAsSAAALEgHS3X78AAAA4klEQVRYhWPU6v91RFv4jwIv+78/DEMIfP7JxHL1LcuDqwWsNsiuZgF5ZqLLB+mh5BkYyN8jwMDAwIoixjTUYgYZ8LL/Ew9b/P2J9oTfR2DCTIPCZWQCQfb/LKDUBUplMBNYhponsAFYTIHy1JCOIRhAjqlh4SEYAJUHw8pDDEO9UMAGRj002MGohwY7GH4eArVaB4E7yAIffzFiaAM3wUGtVlDzAVTjDgmfQD3z6SdmAmOB9CdYGUBtoRbbodmNQI4peIwMl5hi/P//P4oCUEwN4Q7fU4yYQIqpodclf8vyAAC+a17T0iNSKwAAAABJRU5ErkJggg==`;
