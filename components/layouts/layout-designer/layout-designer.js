ODA({ is: 'oda-layout-designer', imports: '@tools/containers',
    template: /*html*/`
        <style>
            :host {
                overflow-x: hidden;
                overflow-y: auto;
                @apply --vertical;
            }
        </style>
        <oda-layout-designer-structure class="flex content" :layout style="padding-top: 16px;" :root_savekey="rootSaveKey"></oda-layout-designer-structure>
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
        iconSize: 24
    },
    get rootSaveKey() {
        return (this.saveKey ? this.saveKey + '_' : '') + 'root';
    },
    get layout() {
        return this.data && new Layout(this.data, this.keys);
    },
    editTemplate: 'span',
    structureTemplate: 'oda-layout-designer-structure',
    lays: null,
    scripts: null,
    async makeScript(layout, action) {
        this.scripts ||= new Map();
        const actions = this.scripts.get(layout.root) || [];
        actions.push(action);
        this.scripts.set(layout.root, actions);
        this.lays.add(layout);
    },
    saveScripts() {
        this.scripts ||= new Map();
        for (const [root, actions] of this.scripts) {
            root.str.actions ||= [];
            root.str.actions.push(...actions);
        }
        this.scripts = null;
    },
    clearSavedScripts() {
        this.scripts = null;
        this.lays.forEach(i => {
            i.str?.actions && (i.str.actions = []);
            i.root.str.actions = [];
        })
        document.location.reload();
    },
    async showSettings(e){
        if (!this.designMode) return;
        await ODA.showDropdown(
            'oda-layout-designer-settings',
            { layout: this.selection[0] || this.layout || {}, self: this },
            { parent: e.target || e, intersect: true, align: 'left', title: 'Settings' }
        );
    },
})

ODA({ is: 'oda-layout-designer-structure',
    template: /*html*/`
        <style>
            :host {
                position: relative;
                align-items: {{layout?.align ==='vertical' ? 'normal' : 'flex-end'}};
                @apply --horizontal;
                @apply --no-flex;
                overflow: visible;
                flex-wrap: wrap;
                justify-content: space-around;
                align-content: flex-start;
                flex-direction: {{layout?.align === 'vertical' ? 'column' : 'row'}};
            }
            [selected] {
                background-color: var(--selection-background, hsla(192, 100%, 50%, 0.1));
                box-shadow: inset 0 0 0 1px blue;
            }
        </style>
        <div @tap.stop="_select" ~is="next.isBlock?'oda-layout-designer-structure':'oda-layout-designer-container'" ~for="next in layout?.items" :layout="next" :icon-size :selected="designMode && selection.has(next)" ~style="{order: next._order ?? 'unset'}"></div>
    `,
    _select(e){
        if (!this.designMode) return;
        if (e.sourceEvent.ctrlKey){
            const el = this.selection[0];
            if (el && !this.layout.items.includes(el)) return;
            if (this.selection.includes( e.target.layout))
                this.selection.remove(e.target.layout);
            else
                this.selection.add(e.target.layout);
        }
        else
            this.selection.splice(0, this.selection.length, e.target.layout)
    },
    props: {
        layout: {
            default: null,
            set(n) {
                if (n)
                    n.str= this;
            }
        },
        root_savekey: '',
        actions: {
            default: [],
            save: true
        },
        saveKey: ''
    },
    observers: [
        async function execute(layout, actions) {
            if (layout) {
                this.saveKey = layout.saveKey = this.root_savekey || (this.rootSaveKey + '_' + layout.id || layout.name || layout.showLabel);
                this.lays ||= new Set();
                if (actions?.length && !this.lays.has(this.layout)) {
                    await this.layout.execute(actions);
                    this.lays.add(this.layout); // for single execution - to remove looping
                    (this.layout.styles || []).forEach(i => {
                        if (i.type === 'str')
                            this.style[i.key] = i.value;
                    })
                }
            }
        }
    ]
})
ODA({ is: 'oda-layout-designer-block',
    template: `
        <style>
            :host{
                @apply --flex;
            }
        </style>
        <oda-layout-designer-structure class="content" :layout></oda-layout-designer-structure>
    `
})
ODA({ is: 'oda-layout-designer-pages',
    template: `
        <style>
            :host{
                @apply --flex;
            }
        </style>
        <oda-layout-designer-structure class="content" :layout="layout?.$focused"></oda-layout-designer-structure>
    `
})
ODA({ is: 'oda-layout-designer-tabs', imports: '@oda/button',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                margin: 4 0px;
            }
            [focused] {
                @apply --content;
            }
            .tab {
                white-space: nowrap;
                text-overflow: ellipsis;
                margin: 2px;
                padding: 8px;
                cursor: pointer; 
                font-size: {{fontSize}};
            }
            oda-button.btn {
                transform: scale(.6);
                padding: 0px;
            }
            [contenteditable] {
                outline: 0px solid transparent;
            }
        </style>
        <div class="horizontal flex header" style="flex-wrap: wrap; border: 1px solid gray;">
           <div @mousedown.stop.prev="selectTab(item)" ~for="layout?.items" class="horizontal" style="align-items: start; border-right: 1px solid gray;" ~style="{'box-shadow': hoverItem === item ? 'inset 4px 0 0 0 var(--success-color)' : ''}"
                    :draggable :focused="item === layout.$focused" @dragstart.stop="ondragstart($event, item)" @dragover.stop="ondragover($event, item)"
                    @dragleave.stop="ondragleave" @drop.stop="ondrop($event, item)">
                <label class="tab" :contenteditable="designMode" @blur="tabRename($event, item)" @tap="selectLabel" ~html="item.title"></label>
                <oda-button class="btn" :icon-size ~if="designMode" icon="icons:close" @tap.stop="removeTab($event, item)"></oda-button>
            </div>
            <oda-button @tap.stop="addTab" ~if="designMode" icon="icons:add" title="add tab"></oda-button>
            <oda-button @tap.stop="selectTab(layout.$focused, true)" ~if="designMode" icon="icons:pin" title="pin current tab" icon-size="14"></oda-button>
        </div>
    `,
    props: {
        fontSize: 'small'
    },
    get draggable() {
        return this.layout && this.designMode ? 'true' : 'false';
    },
    hoverItem: undefined,
    addTab() {
        const tabID = getUUID();
        const blockID = getUUID();
        const action = { id: tabID, action: "addTab", props: { tabs: this.layout.id, tab: tabID, block: blockID } };
        this.layout.addTab(action, this.layout);
        this.makeScript(this.layout, action);
    },
    removeTab(e, item) {
        const action = { action: "removeTab", props: { tabs: this.layout.id, tab: item.id } };
        this.layout.removeTab(action, item);
        this.makeScript(this.layout, action);
    },
    selectTab(item, force) {
        this.layout.$expanded = true;
        this.layout.$focused = item;
        if (this.designMode && force) {
            const action = { action: "selectTab", props: { tabs: this.layout.id, tab: item.id } };
            this.makeScript(this.layout, action);
        }
        this.render();
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
        this.makeScript(this.layout, this.dragInfo._action);
        this.hoverItem = undefined;
        this.dragInfo.isMoveTab = false;
    },
    tabRename(e, item) {
        if (this.designMode && this.label !== e.target.innerHTML) {
            console.log(e.target.innerHTML)
            const action = { action: "setLabel", label: e.target.innerHTML, props: { id: item.id } };
            this.makeScript(this.layout, action)
        }
    }
})

ODA({ is: 'oda-layout-designer-container', imports: '@oda/icon, @oda/menu, @tools/containers',
    template: `
        <style>
            :host {
                /*align-self: end;*/
                padding-right: 4px;
                box-sizing: border-box;
                @apply --vertical;
                overflow: hidden;
                @apply --flex;
                /* flex-grow: {{layout?.noFlex?'1':'100'}}; */
                flex: {{width?'0 0 auto':'1000000000000000000000000000000 1 auto'}};
                /* flex-basis: auto; */
                cursor: {{designMode ? 'pointer' : ''}};
                position: relative;
                min-height: {{iconSize + 4}}px;
                border: {{designMode ? '1px dashed lightblue' : '1px solid transparent'}};
                min-width: {{layout?.minWidth ? layout?.minWidth : hasChildren ? '100%' : '32px'}};
                max-width: {{layout.maxWidth ? layout.maxWidth : 'unset'}};
                width: {{layout.width ? layout.width : 'unset'}};
            }
            :host([is-group]){
                @apply --border;
                @apply --header;
                @apply --shadow;
                border-radius: 4px;
            }

            [disabled] {
                pointer-events: none;
                opacity: .5;
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
            .label {
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: {{fontSize}};
                cursor: {{designMode ? 'pointer' : 'unset'}};
            }
            [contenteditable] {
                outline: 0px solid transparent;
            }
        </style>
        <div class="vertical flex" style="overflow: hidden; padding-top: 4px;" :draggable ~class="{'drag-to':layout?.dragTo, [layout?.dragTo]:layout?.dragTo}" ~style="layout?.style || ''" @mousedown.stop.prev>
            <label class="label" ~if="layout.title" :contenteditable="designMode" @blur="setLabel" @tap="selectLabel" ~html="layout?.title"></label>
            <div class="horizontal flex" style="align-items: center;">
                <oda-icon ~if="hasChildren" style="cursor: pointer" :icon-size :icon="layout?.$expanded?'icons:chevron-right:90':'icons:chevron-right'" @pointerdown.stop @tap.stop="expand()"></oda-icon>
                <div class="vertical flex" style="overflow: hidden;" :disabled="designMode && !layout?.isGroup" 
                        ~style="{alignItems: (width && !layout?.type)?'center':''}">
                        <div class="flex" ~is="layout?.$template || (layout?.isVirtual ? 'span' : editTemplate)" :layout ::width></div>
                </div>
            </div>
        </div>
        <div ~if="hasChildren && layout?.$expanded" ~is="layout?.$structure || structureTemplate" :layout class="flex structure" style="border-left: 1px dashed var(--border-color, silver);" ~style="{marginBottom: '4px', marginLeft: layout?.isGroup ? 0 : iconSize/2+'px', paddingLeft: layout?.isGroup ? 0 : iconSize/2+'px'}"></div>
    `,
    fontSize: 'small',
    width: undefined,
    get hasChildren() { return this.layout?.items?.length },
    expand() {
        this.layout && (this.layout.$expanded = !this.layout.$expanded);
        if (this.designMode) {
            const action = { action: "expanded", props: { target: this.layout.id, value: this.layout.$expanded } };
            this.makeScript(this.layout, action);
            this.render();
        }
    },
    props:{
        label:{
            default:{
                color: 'black',
                align: 'top',
                hidden: false
            },
            save: true
        },
        isGroup:{
            type: Boolean,
            get(){
                return this.layout?.isGroup;
            },
            reflectToAttribute: true
        }
    },
    listeners: {
        'contextmenu': 'showContextMenu',
        'dragstart': 'ondragstart',
        'dragend': 'ondragend',
        'dragover': 'ondragover',
        'dragleave': 'ondragleave',
        'drop': 'ondragdrop',
    },
    async showContextMenu(e) {
        if (!this.designMode) return;
        e.preventDefault();
        e.stopPropagation();
        const parent = e.target.id === 'settings' ? e.target : undefined;
        await ODA.showDropdown('oda-layout-designer-contextMenu', { layout: this.layout, lay: this }, { parent, title: e.target.layout?.label });
    },
    labelPos: 'top',
    layout: null,
    get draggable() {
        return this.layout && this.designMode && !this.layout.isVirtual ? 'true' : 'false';
    },
    attached() {
        this.async(() => {
            this.layout.cnt = this;
            (this.layout.styles || []).forEach(i => {
                if (i.type === 'cnt')
                    this.style[i.key] = i.value;
                (this.layout.owner?.styles || []).forEach(i => {
                    if (i.type === 'str')
                        this.layout.owner.str.style[i.key] = i.value;
                })
            })
        }, 100);
    },
    addTab() {
        const tabID = getUUID();
        const blockID = getUUID();
        const action = { id: tabID, action: "addTab", props: { tabs: this.layout.id, tab: tabID, block: blockID } };
        this.layout.addTab(action, this.layout);
        this.makeScript(this.layout, action);
        this.render();
    },
    removeTab(tab) {
        const action = { action: "removeTab", props: { tabs: this.layout.id, tab: tab.id } };
        this.layout.removeTab(action, tab);
        this.makeScript(this.layout, action);
    },
    selectLabel() {
        document.execCommand('selectAll', false, null);
    },
    setLabel(e) {
        if (!this.designMode) return
        this.layout.title = e.target.innerHTML;
        const action = { action: "setLabel", label: this.layout.title, props: { id: this.layout.id } };
        this.makeScript(this.layout, action);

    },
    ondragstart(e) {
        e.stopPropagation();
        this.dragInfo.isMoveTab = false;
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
            let y = e.layerY,
                h = e.target.offsetHeight;
            y = (y - h / 2) / h * 2;
            if (Math.abs(x) > Math.abs(y))
                to = x < 0 ? 'left' : 'right';
            else
                to = y < 0 ? 'top' : 'bottom';
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
        this.dragInfo._action = { id: getUUID(), action: 'move', props: { item: this.dragInfo.dragItem.id, target: this.dragInfo.targetItem.id, to: this.dragInfo.to } };
        this.layout.move(this.dragInfo);
        this.makeScript(this.layout, this.dragInfo._action);
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
    },
    createGroup() {
        const action = { tabsId: getUUID(), id: getUUID(), action: "createGroup", props: { target: this.layout.id, block: getUUID() } };
        this.layout.createGroup(action);
        this.makeScript(this.layout, action);
    },
    hideLayout(e) {
        e?.stopPropagation();
        this.layout.isHide = !this.layout.isHide;
        this.render();
        const action = { action: "hideLayout", hideLayout: this.layout.isHide, props: { target: this.layout.id } };
        this.makeScript(this.layout, action);
    },
    hideGroupLabel() {
        this.layout.hideLabel = !this.layout.hideLabel;
        this.render();
        const action = { action: "hideGroupLabel", hideGroupLabel: this.layout.hideLabel, props: { target: this.layout.id } };
        this.makeScript(this.layout, action);
    },
    deleteGroup() {
        if (this.layout.items[0]?.isTab1) {
            this.removeTab(this.layout.items[0]);
        }
        const action = { action: "deleteGroup", props: { target: this.layout.id } };
        this.layout.deleteGroup(action, this.layout);
        this.makeScript(this.layout, action);
    }
})

ODA({ is: 'oda-layout-designer-contextMenu', imports: '@oda/icon',
    template: `
        <style>
            :host {
                @apply --vertical;
                background-color: white;
                border: 1px solid gray;
                margin: 2px;
                padding: 4px;
                min-width: 180px;
            }
            oda-icon {
                transform: scale(.8);
                padding: 0 4px 0 0;  
            }
            label {
                cursor: pointer;
                margin-right: auto;
            }
            .row {
                padding: 1px 0;
            }
            .row:hover {
                background: lightgray;
            }
            span {
                font-size: small;
                color: gray;
                border-bottom: 1px solid lightgray;
            }
        </style>
        
        <span>Group</span>
        <div class="horizontal row" style="align-items: center" @tap="lay.createGroup()">
            <oda-icon icon="av:library-add"></oda-icon>
            <label>create group</label>
        </div>
        <div ~if="layout.isGroup" class="vertical">
            <div class="horizontal row" style="align-items: center" @tap="lay.hideGroupLabel()">
                <oda-icon icon="material:format-text" :fill="layout.hideLabel ? 'red' : ''"></oda-icon>
                <label>{{layout.hideLabel ? 'unhide' : 'hide'}} group label</label>
            </div>
            <div class="horizontal row" style="align-items: center" @tap="lay.deleteGroup(); fire('ok');">
                <oda-icon icon="icons:delete"></oda-icon>
                <label>delete group</label>
            </div>
        </div>

        <span>Layout</span>
        <div class="horizontal row" style="align-items: center" @tap="lay.hideLayout(); lay.render(); render()">
            <oda-icon icon="image:remove-red-eye" :fill="layout.isHide ? 'red' : ''"></oda-icon>
            <label>{{layout.isHide ? 'unhide' : 'hide'}} layout</label>
        </div>
    `,
    layout: null,
    lay: null
})
import '/web/oda/tools/property-grid/test/new/property-grid.js';
ODA({ is:'oda-layout-designer-settings', // imports: '@tools/property-grid2',
    template:`
        <style>
            :host{
                @apply --horizontal;
                width: 400px;
                @apply --flex;
                height: calc(100vh - 40px);
            }
            div>div{
                align-items: center;
                @apply --horizontal;
                padding: 8px 4px;
                cursor: pointer;
            }
            div>div:hover{
                color: var(--focused-color) !important;
            }
            oda-icon{
                transform: scale(.7);
            }
            div>div[focused]{
                background-color: var(--content-background) !important;
            }
        </style>
        <div class="content flex vertical" style="padding: 4px; overflow: hidden;">
            <oda-property-grid2 class="flex" ~if="focusedTab === 0" :io @pg-changed="setStyle" show-buttons="false" show-search></oda-property-grid2>
        </div>
        <div style="writing-mode: vertical-lr;" class="horizontal header">
            <div :focused="focusedTab === index" @tap="focusedTab = index" ~for="tabs"><oda-icon :icon="item.icon" :title="item.title"></oda-icon>{{item.title}}</div>
        </div>
    `,
    focusedTab: 0,
    tabs: [
        {icon: 'icons:settings:90', title: 'properties'},
    ],
    layout: null,
    get io() { return this.layout?.cnt?.style || this.layout?.str?.style },
    setStyle(e) {
        const type = this.layout.cnt ? 'cnt' : 'str';
        const action = { action: "setStyle", props: { type, target: this.layout.id, key: e.detail.value.key, value: e.detail.value.value } };
        this.self.makeScript(this.layout, action);
        // console.log(action);
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
    get title(){
        return this._label || this.label;
    },
    set title(n){
        this._label = n;
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
        return this.isGroup ? 'oda-layout-designer-tabs' : '';
    },
    get $structure() {
        return this.isGroup ? 'oda-layout-designer-pages' : '';
    },
    get isGroup() {
        return this.type === "group";
    },
    get isBlock() {
        return this.type === "block";
    },
    async createGroup(action) {
        const item = action ? await this.find(action.props.target) : this;
        if (!item) return;
        const myIdx = item.owner.items.indexOf(item);
        const tabs = new Layout({ id: action.tabsId, label: `Group-label` }, item.key, item.owner, item.root);
        const tab = new Layout({ id: action.id, label: `Tab 1` }, item.key, tabs, item.root);
        tabs.type = 'group';
        tabs.width = 0;
        tabs.items = [tab];
        tabs.$expanded = true;
        tabs.$focused = tab;
        tabs.order = item.order;
        tabs._order = item._order;
        tab._hideHeader = true;
        tab.$expanded = true;
        tab.items = [item];
        tab.order = tab._order = 0;
        tab.type = 'tab';
        tab.isTab1 = true;
        tab.blockID = action.props.block;
        item.owner.items.splice(myIdx, 1, tabs);
        item.owner = tab;
    },
    async addTab(action, layout) {
        let tabs = layout || await this.find(action.props.tabs);
        if (!tabs) return;
        const tab = new Layout({ id: action.id, label: `Tab ${tabs.items.length + 1}` }, tabs.key, tabs, tabs.root);
        tab.type = 'tab';
        tabs.items.push(tab)
        tabs.$focused = tab;
        const block = new Layout({ label: ` ` }, tabs.key, tab, tabs.root);
        block.isVirtual = true;
        tab.blockID = block.id = action.props.block;
        tab.items = [block];
        tab.order = tab._order = tabs.items.length
    },
    async removeTab(action, layout) {
        const tabs = layout ? this : await this.find(action.props.tabs);
        const tab = layout || await this.find(action.props.tab);
        if (!tabs || !tab) return;
        tab.root.items.splice(tab.owner.items.indexOf(tabs), 0, ...tab.items.filter(i => {
            i.owner = i.root;
            i._order = i.order;
            if (!i.isVirtual) return i;
        }));
        tabs.items.splice(tabs.items.indexOf(tab), 1);
        if (tabs.items.length === 0) {
            tabs.owner.items.splice(tabs.owner.items.indexOf(tabs), 1);
        }
    },
    async selectTab(action, layout) {
        const tabs = layout ? this : await this.find(action.props.tabs);
        const tab = layout || await this.find(action.props.tab);
        if (!tabs || !tab) return;
        tabs.$focused = tab;
    },
    async setLabel(action, layout) {
        // console.log(action.props.id)
        const lay = layout || await this.find(action.props.id);
        if (!lay) return;
        lay.title = action.label;
    },
    async hideLayout(action, layout) {
        const item = layout || await this.find(action.props.target);
        if (!item) return;
        item.isHide = action.hideLayout;
    },
    async hideGroupLabel(action, layout) {
        const item = layout || await this.find(action.props.target);
        if (!item) return;
        item.hideLabel = action.hideGroupLabel;
    },
    async deleteGroup(action, layout) {
        const group = layout || await this.find(action.props.target);
        if (!group) return;
        const idx = group.owner.items.indexOf(group);
        if (group.items?.length) {
            group.items.forEach(i => {
                i.owner = group.owner;
                i._order = i.order;
            })
            group.owner.items.splice(idx, 1, ...group.items);
        }
    },
    async setStyle(action, layout) {
        const item = layout || await this.find(action.props.target);
        if (!item) return;
        item.styles ||= [];
        item.styles.push({ key: action.props.key, value: action.props.value, type: action.props.type });
    },
    async move(dragInfo) {
        const action = dragInfo?._action || dragInfo;
        const dragItem = dragInfo.dragItem || await this.find(action.props.item);
        const targItem = dragInfo.targetItem || await this.find(action.props.target);
        if (!dragItem || !targItem) return;
        await dragItem.items;
        await targItem.items;
        if (action.props.to === 'left' || action.props.to === 'right') {
            if (targItem.owner.align === 'vertical') {
                this._createBlock(action, dragItem, targItem, 'horizontal');
            } else {
                this._makeMove(action, dragItem, targItem);
            }
        } else {
            if (targItem.owner.align === 'vertical') {
                this._makeMove(action, dragItem, targItem);
            } else {
                this._createBlock(action, dragItem, targItem, 'vertical');
            }
        }
    },
    _makeMove(action, dragItem, targItem) {
        const moveTo = action.props.to;
        let idxTarg = targItem._order;
        dragItem._order = idxTarg = (moveTo === 'left' || moveTo === 'top') ? idxTarg - .1 : idxTarg + .1;
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
    _createBlock(action, dragItem, targItem, align = 'horizontal') {
        const moveTo = action.props.to;
        const block = new Layout({ id: action.id || getUUID()}, targItem.key, targItem.owner, targItem.root);
        let idxTarg = targItem.owner.items.indexOf(targItem);
        const target = targItem.owner.items.splice(idxTarg, 1, block)[0];
        const idxDrag = dragItem.owner.items.indexOf(dragItem);
        const drag = dragItem.owner.items.splice(idxDrag, 1)[0];
        drag.owner = target.owner = block;
        block.$expanded = true;
        block.order = target.order;
        block._order = target._order;
        block.type = 'block';
        block.align = align
        block.items = [drag, target];
        if (moveTo === 'left' || moveTo === 'top') {
            drag._order = 0;
            target._order = 1;
        } else {
            drag._order = 1;
            target._order = 0;
        }
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
        if (item.id === id) return item;
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
