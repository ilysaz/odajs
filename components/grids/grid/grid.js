ODA({is:'oda-grid', imports: '@oda/icon, @oda/button, @tools/containers, @oda/splitter',
    template:`
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
                overflow: hidden;
            }
        </style>   
        <oda-grid-groups class="header">GROUPS</oda-grid-groups>
        <div class="flex horizontal">
            <div ~if="columns?.some(i=>i.fix === 'left')" class="horizontal header no-flex">
                <oda-grid-part @resize="correctPanelSize" fix="left"></oda-grid-part>
                <oda-splitter :size="sizerWidth" :color="sizerColor"></oda-splitter>
            </div>
            <oda-grid-part style="overflow: hidden;"></oda-grid-part>
            <div ~if="columns?.some(i=>i.fix === 'right')" class="horizontal header no-flex">
                <oda-splitter :size="sizerWidth" :color="sizerColor"></oda-splitter>
                <oda-grid-part fix="right"></oda-grid-part>
            </div>      
        </div>
        <oda-button :icon-size icon="icons:settings" @tap="showSettings" style="position: absolute; right: 0px; top: 0px; z-index: 1; border-radius: 50%;"></oda-button>
    `,
    correctPanelSize(e){
        e.target.parentElement.style.minWidth =  e.target.offsetWidth+'px';
    },
    async showSettings(e){
        await ODA.import('@tools/property-grid');
        try{
            await ODA.showDropdown(
                'oda-property-grid',
                { inspectedObject: this.table, onlySave: true, style: 'max-width: 500px; min-width: 300px;' },
                { parent: e.target, intersect: true, align: 'left', title: 'Settings', hideCancelButton: true }
            );
        }
        catch (e){}
    },
    metadata:[],
    dataSet: [],
    groups: [],
    get table(){
        return this;
    },
    get tableWidth(){
        return this.clientWidth;
    },
    headerResize(e){
        this.interval('header-resize',()=>{
            const headers = this.table.$$('oda-grid-header')
            let height = 0;
            headers.forEach(h=>{
                h.style.minHeight = '';
                if (height < h.scrollHeight)
                    height = h.scrollHeight;
            })
            headers.forEach(h=>{
                h.style.minHeight = height+'px';
            })
        })
    },
    get columns(){
        return this.metadata.map((col, idx)=>{
            col.$order = col.$order || (idx+1);
            return col
        });
    },
    get visibleColumns(){
        const convertColumns = (items)=>{
            return items.reduce((res, col)=>{
                if (!col.items?.length || !col.$expanded){
                    res.push(col);
                }
                else{
                    res.push(...convertColumns(col.items));
                }
                return res;
            }, [])
        }
        return convertColumns(this.columns)
    },
    props:{
        sizer:{
            default:{
                width: 1,
                color: 'red'
            },
            save: true
        },
        sizerColor:{
            default: 'gray',
            save: true,
            editor: '@oda/color-picker'
        },
        sizerWidth:{
            default: 1,
            save: true,
        },
        autoWidth: {
            default: false,
            save: true
        },
        iconSize:{
            default: 24,
            save: true
        },
        showFilter:{
            default: true,
            save: true,
            set(n){
                this.headerResize();
            }
        },
        showFooter:{
            default: false,
            save: true
        },
        showHeader:{
            default: true,
            save: true
        }
    },
    colsScrollLeft: 0,
    sorts: []
})
ODA({is: 'oda-grid-part',
    template:`
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
            }
        </style>        
        <oda-grid-header ~if="showHeader"></oda-grid-header>
        <oda-grid-body class="flex"></oda-grid-body>
        <oda-grid-footer  ~if="showFooter"></oda-grid-footer>
    `,
    fix: '',
    get columns(){
        return this.table.columns?.filter(col=>((col.fix || '') === (this.fix || '')));
    }
})
ODA({is:'oda-grid-header',
    template: `
        <style>
            :host{
                position: relative;
                border-top: 1px solid gray;
                @apply --horizontal;
                @apply --dark;
                overflow: hidden;
                @apply --raised;
                overflow-y: visible;
            }
        </style>
        <div class="flex horizontal" style="overflow: hidden;" :scroll-Left="colsScrollLeft">
            <div class="horizontal" style="min-width: 100%; position: relative;" ~class="{flex: fix}">
                <oda-grid-header-cell ~for="columns" :last="item === items.last" :column="item" :parent-items="items" ~style="{order: item.$order}" ~class="getColumnClass(items, item, true)"></oda-grid-header-cell>
            </div>
        </div>
    `,
    getColumnClass(items, item, top){
        let flex;
        if (top && !this.fix && item === items.last)
            flex = this.autoWidth;
        else if (item === items.last)
            flex = true;
        else
            flex = !item.width && this.autoWidth;
        return {flex: flex, "no-flex": !flex};
    }
})
ODA({is: 'oda-grid-header-cell',
    template: `
        <style>
            :host{
                @apply --vertical;
                overflow: hidden;   
                cursor: pointer;
                @apply --header;
                @apply --raised;
                position: relative;
                font-weight: bold;
            }
            oda-button{
                font-size: x-small;
            }
            input{
                width: auto;
                max-height: {{iconSize * .7}}px;
                margin: 2px;
                width: 1px;
                outline: none;
            }
        </style>
        <div class="horizontal flex" style="align-items: center; overflow: hidden; border-bottom: 1px solid gray;" ~style="getStyle()" @tap="sort()" @track="onMove">
            <oda-icon ~if="column?.items" style="opacity: .3" :icon-size :icon="column?.$expanded?'icons:chevron-right:90':'icons:chevron-right'" @tap.stop="column.$expanded = !column.$expanded"></oda-icon>
            <span class="flex" style="text-overflow: ellipsis; overflow: hidden; padding: 4px 0px 4px 4px;">{{title}}</span>
            <oda-icon :bubble="sorts.indexOf(column) + 1" ~show="offsetWidth > iconSize * 2"  :icon="column?.$sort?(column.$sort === 2?'icons:arrow-drop-up':'icons:arrow-drop-down'):'icons:apps'" :icon-size="iconSize/2" ~style="{opacity: column?.$sort>0?1:.1}">{{column.$sort}}</oda-icon>
            <span class="no-flex" style="height: 100%; cursor: col-resize;" ~style="{width: sizerWidth + 3 + 'px',visibility: hideSizer?'hidden':'visible', 'border-right': sizerWidth+'px solid ' + sizerColor}" @track="onColSizeTrack"></span>
        </div>       
        <div ~if="column?.items" ~show="column?.$expanded" class="horizontal flex dark" >
            <oda-grid-header-cell ~for="columns" :column="item" :parent-items="items" ~class="getColumnClass(items, item)" :last="item === items.last" ~style="{order: item.$order}" ></oda-grid-header-cell>
        </div>
        <div class="horizontal flex" ~if="showFilter && !column?.$expanded" ~style="{maxHeight: iconSize+'px'}">
            <input class="flex" ::value="filter" ~style="{visibility: (offsetWidth > iconSize * 2)?'visible':'hidden'}">
            <oda-icon  icon="icons:filter" :icon-size="iconSize * .4" style="padding: 0px;"></oda-icon>
            <span class="no-flex" style="height: 100%;" ~style="{width: sizerWidth + 3 + 'px', visibility: hideSizer?'hidden':'visible', 'border-right': sizerWidth+'px solid ' + sizerColor}"></span>
        </div>
    `,
    get columns(){
        return this.column?.items?.map((col, idx)=>{
            col.$order = col.$order || (idx+1);
            return col
        })
    },
    sort(){
        switch (this.column.$sort){
            case 1:{
                this.column.$sort++;
            } break;
            case 2:{
                delete this.column.$sort;
                this.sorts.splice(this.sorts.indexOf(this.column),1);
            } break;
            default:{
                this.column.$sort = 1;
                this.sorts.push(this.column);
            }
        }
    },
    filter: undefined,
    parentItems: null,
    props:{
        title:{
            get(){
                return (this.column?.label ||  this.column?.name)/*+(this.column.$width || '')+':'+(this.column.width || '')+':'+this.test*/;
            },
            reflectToAttribute: true
        }

    },
    column: null,
    listeners:{
        resize(e){
            this.interval('column-resize', ()=>{
                this.headerResize();
                this.column.$width = this.offsetWidth;
            })

        }
    },
    getStyle(){
        const min = this.iconSize / 2 *  (this.column?.items?.length || 1);
        const res  = {minWidth: min + 'px'};
        if (this.column.width){
            if (this.autoWidth && this.last){
                res.width = 'auto';
                // res.minWidth = this.column.width +'px';
            }
            else if (!this.column?.$expanded || this.offsetWidth <= this.column.width)
                res.width = this.column.width + 'px';
            else
                res.width = 'auto';
        }
        else{
            res.width = 'auto';
        }
        return res;
    },
    test: '',
    get hideSizer(){
        return ((this.fix || this.autoWidth) && this.last && (this.domHost?.localName !== this.localName ||  (this.domHost?.last && this.domHost?.hideSizer)));
    },
    last: false,
    onColSizeTrack(e){
        const target = e.detail.target.parentElement;
        switch(e.detail.state){
            case 'start':{
                if (this.autoWidth){
                    let stopElement = this;
                    let dom = this.domHost;
                    while (dom){
                        const columns = dom.$$(this.localName);
                        if (!columns.length)
                            break;
                        for (let col of columns){
                            if (col === stopElement) break;
                            col.style.maxWidth = col.style.width = col.column.$width + 'px';
                            col.column.width = col.offsetWidth;
                        }
                        stopElement = dom;
                        dom = dom.domHost;
                    }
                }
                let items = this.column.items;
                while (items){
                    const last = items.last;
                    if (last)
                        last.width = 0;
                    items = last?.items;
                }
                if (this.last) {
                    let host = this.domHost;
                    while (host?.last) {
                        host.column.width = 0;
                        host = host.domHost;
                    }
                }
            } break;
            case 'track':{
                const pos = e.detail.target.getBoundingClientRect().x + e.detail.target.offsetWidth;
                if ((e.detail.ddx < 0 && e.detail.x < pos) || (e.detail.ddx > 0 && e.detail.x > pos)) {
                    if (this.column.items?.length){
                        target.style.width = this.offsetWidth + e.detail.ddx + 'px';
                        target.style.width = this.offsetWidth+'px';
                    }
                    else
                        target.style.width = target.offsetWidth + e.detail.ddx + 'px';
                }
                this.column.width = target.offsetWidth;
                target.style.width = undefined;
            } break;
            case 'end': {
                if (this.autoWidth){
                    for (let col of this.domHost.$$(this.localName)){
                        col.style.width = col.style.maxWidth = col.style.minWidth = '';
                    }
                }
            } break;
        }
    },
    onMove(e) {
        switch (e.detail.state) {
            case 'start': {
                this.style.opacity = .5;
                this._elements = Array.from(this.parentElement.children);
                this._proxy = this.create('oda-table-drag-proxy', {label: this.title, ...e.detail.start});
                document.body.appendChild(this._proxy);
            } break;
            case 'track': {
                this._proxy.x = e.detail.x;
                this._proxy.y = e.detail.y;
                if (this.parentElement.getBoundingClientRect().y > e.detail.y) return;
                for (let el of this._elements){
                    if (el === this) continue;
                    const pos = el.getBoundingClientRect();
                    if (pos.x > e.detail.x || (pos.x + pos.width) < e.detail.x) continue;
                    if (Math.sign(e.detail.ddx) !== Math.sign(el.column.$order - this.column.$order)) continue;
                    const order = this.column.$order;
                    this.column.$order = el.column.$order;
                    el.column.$order = order;
                }
            } break;
            case 'end': {
                this._proxy.remove();
                this.style.opacity = '';
            } break;
        }
    }
})
ODA({is: 'oda-table-drag-proxy',
    template:`
        <style>
            :host{
                visibility: visible !important;
                @apply --horizontal;
                align-items: center;
                @apply --raised;
                @apply --no-flex;
                @apply --content;
                position: fixed;
                opacity: 1 !important;
                @apply --disabled;
                max-width: 200px;
                overflow: hidden;
                white-space: nowrap;
                top: 0px;
                left: 0px;
                transform: translate3d({{x}}px, {{y}}px, 0px);
            }
        </style>
        <oda-icon icon-size="16" :icon style="margin: 4px;"></oda-icon>
        <span style="margin-right: 4px; text-overflow: ellipsis; overflow: inherit;">{{label}}</span>
    `,
    icon: 'icons:open-with',
    label: 'PROXY',
    x: 0,
    y: 0
})
ODA({is: 'oda-grid-groups',
    template:`
        <style>
            :host{
                @apply --horizontal;
                padding: 4px;
            }
        </style>
        <label disabled if="groups.length">Drag here to set row groups</label>
        <div ~for="groups">{{item}}</div>
    `,
})
ODA({is: 'oda-grid-body',
    template: `
        <style>
            :host{
                @apply --vertical;
            }
        </style>
            BODY
    `
})
ODA({is: 'oda-grid-footer',
    template: `
        <style>
            :host{  
                @apply --header;
                @apply --raised;
            }
        </style>
            footer
    `
})