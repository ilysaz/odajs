ODA({ is: 'oda-jupyter',
    template: /*html*/`
        <style>
            :host {
                @apply --flex;
                @apply --vertical;
                padding: 12px 0;
                position: relative;
                min-height: 28px;
            }
        </style>
        <oda-jupyter-cell-addbuttons ~if="!notebook?.cells?.length" style="top: 6px; left: 4px;"></oda-jupyter-cell-addbuttons>
        <oda-jupyter-cell ~for="cell in notebook?.cells" :cell :idx="index"></oda-jupyter-cell>
    `,
    props: {
        url: {
            default: '',
            async set(n) {
                await this.loadURL(n);
            }
        },
        readOnly: false,
        focusedCell: {
            type: Object,
            set(v) {
                this.editedCell = undefined
            }
        },
        showBorder: false // show cell border for mode is not readOnly
    },
    notebook: {},
    editedCell: undefined,
    loadURL(url = this.url) {
        this.focusedCell = undefined;
        if (url) 
            fetch(url).then(response => response.json()).then(json => this.notebook = json);
    }
})

ODA({ is: 'oda-jupyter-cell',
    template: /*html*/`
        <style>
            :host {
                display: block;
                position: relative;
                margin: 6px 12px;
                order: {{cell?.order || 0}};
                box-shadow: {{!readOnly && showBorder ? 'inset 0px 0px 0px 1px lightgray' : ''}};
            }
            .focused {
                box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.4);
            }
        </style>
        <oda-jupyter-cell-toolbar ~if="!readOnly && focusedCell===cell" :cell></oda-jupyter-cell-toolbar>
        <div ~class="{focused: !readOnly && focusedCell===cell}" ~is="cellType" :id="'cell-'+cell?.order" @tap="focusedCell=cell" :cell></div>
        <oda-jupyter-cell-addbuttons ~if="!readOnly && focusedCell===cell" :cell></oda-jupyter-cell-addbuttons>
        <oda-jupyter-cell-addbuttons ~if="!readOnly && focusedCell===cell" :cell position="bottom"></oda-jupyter-cell-addbuttons>
    `,
    props: {
        idx: {
            type: Number,
            set(v) {
                this.cell.order = v;
            }
        }
    },
    cell: {},
    get cellType() {
        if (this.cell?.cell_type === 'markdown') return 'oda-jupyter-cell-markdown';
        if (this.cell?.cell_type === 'code') return 'oda-jupyter-cell-code';
        return 'div';
    }
})

ODA({ is: 'oda-jupyter-cell-toolbar', imports: '@oda/button',
    template: /*html*/`
        <style>
            :host {
                display: flex;
                position: absolute;
                right: 8px;
                top: -18px;
                z-index: 21;
                box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.4);
                background: white;
                width: 200px;
                height: 24px;
            }
            oda-button {
                border-radius: 3px;
                margin: 2px 0px;
            }
        </style>
        <oda-button icon="icons:arrow-back:90" :icon-size @tap="tapOrder($event, -1.1)" :disabled="cell.order<=0" title="move up"></oda-button>
        <oda-button icon="icons:arrow-forward:90" :icon-size @tap="tapOrder($event, 1.1)" :disabled="cell.order>=notebook?.cells?.length-1" title="move down"></oda-button>
        <oda-button icon="icons:select-all" :icon-size title="show cells border" @tap="showBorder=!showBorder" allow-tooglle ::toggled="showBorder"></oda-button>
        <oda-button icon="editor:mode-edit" :icon-size @tap="editedCell=editedCell===cell?undefined:cell" ~style="{fill: editedCell===cell ? 'red' : ''}" title="edit mode"></oda-button>
        <oda-button ~if="editedCell===cell" icon="icons:settings" :icon-size></oda-button>
        <div class="flex"></div>
        <oda-button icon="icons:delete" :icon-size @tap="tapDelete" title="delete"></oda-button>
    `,
    iconSize: 14,
    cell: {},
    tapOrder(e, v) {
        if (this.focusedCell !== this.cell) return;
        const ord = this.cell.order = this.cell.order + v;
        this.notebook.cells.sort((a, b) => a.order - b.order).map((i, idx) => i.order = idx - 1.1 <= ord ? idx : idx + 1);
    },
    tapDelete() {
        if (this.cell.source === '🔴...' || this.cell.source === ' ' || !this.cell.source) {
            this.notebook.cells.splice(this.cell.order, 1);
            this.notebook.cells.sort((a, b) => a.order - b.order).map((i, idx) => i.order = idx);
            this.focusedCell = this.notebook.cells[(this.cell.order > this.notebook.cells.length - 1) ? this.notebook.cells.length - 1 : this.cell.order];
        }
    }
})

ODA({ is: 'oda-jupyter-cell-addbuttons', imports: '@oda/button',
    template: /*html*/`
        <style>
            :host {
                display: flex;
                position: absolute;
                left: 8px;
                z-index: 21;
                box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.4);
                background: white;
                /* width: 200px; */
                height: 24px;
                opacity: 0.7;
                top: {{ position==='top' ? '-18px' : 'unset' }};
                bottom: {{ position!=='top' ? '-18px' : 'unset' }};
            }
            :host(:hover) {
                opacity: 1;
            }
            oda-button {
                border-radius: 3px;
                margin: 2px 0px;
            }
        </style>
        <oda-button title="add markdown" @tap="addCell('markdown','md','🟠...')" ~style="{color: extType === 'md' || extType === 'markdown'? 'red' : ''}">md</oda-button>
        <!-- <oda-button title="add html" @tap="addCell('html','html','🟢​...')" ~style="{color: extType === 'html' ? 'red' : ''}">html</oda-button> -->
        <oda-button title="add code" @tap="addCell('code','code','🔴...')" ~style="{color: extType === 'code' ? 'red' : ''}">code</oda-button>
    `,
    // ​🔴​🟠​🟡​🟢​🔵​🟣​⚫️​⚪️​🟤​
    props: {
        position: 'top'
    },
    iconSize: 14,
    cell: {},
    get extType() { return this.cell?.cell_extType || this.cell?.cell_type || '' },
    addCell(cell_type, cell_extType, source) {
        const idx = this.cell?.order || 0;
        const ord = this.position === 'top' ? idx - .1 : idx + .1;
        const cell = { order: ord, cell_type, cell_extType, source };
        this.notebook.cells ||= [];
        this.notebook.cells.splice(idx, 0, cell);
        this.notebook.cells.sort((a, b) => a.order - b.order).map((i, idx) => i.order = idx - .1 <= ord ? idx : idx + 1);
    }
})

ODA({ is: 'oda-jupyter-cell-markdown', imports: '@oda/md-viewer, @oda/ace-editor, @oda/splitter',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                @apply --flex;
                min-height: 28px;
            }
            .ace {
                height: unset;
                min-width: 50%;
            }
        </style>
        <oda-ace-editor class="flex ace" ~if="!readOnly&&editedCell===cell" :value="source || cell?.source" highlight-active-line="false" show-print-margin="false" theme="solarized_light" mode:markdown show-gutter="false" min-lines=1></oda-ace-editor></oda-ace-editor>
        <!-- <oda-splitter class="no-flex" ~if="!readOnly&&editedCell===cell" style="width: 4px;"></oda-splitter> -->
        <oda-md-viewer class="flex" :srcmd="cell?.source" :src="cell?.src"></oda-md-viewer>
    `,
    cell: {},
    source: '',
    listeners: {
        change(e) {
            this.source = this.$('oda-ace-editor').value;
            this.debounce('changeCellValue', () => {
                this.cell.source = this.source;
            }, 1000);
        },
        dblclick(e) {
            this.editedCell = this.editedCell === this.cell ? undefined : this.cell;
        }
    },
    observers: [
        function setEditedCell(editedCell) {
            if (editedCell === this.cell) {
                this.source = this.$('oda-md-viewer').source;
            }
        }
    ]
})

ODA({ is: 'oda-jupyter-cell-code', imports: '@oda/ace-editor',
    template: /*html*/`
        <style>
            :host {
                position: relative;
                @apply --horizontal;
                @apply -- flex;
                border: 1px solid #eee;
                padding: 4px;
            }
            .box {
                width: 24px;
                cursor: pointer;
                align-self: flex-start;
                padding-right: 4px;
            }
            .ace {
                height: unset;
            }
        </style>
        <div class="box vertical no-flex">
            <div>[...]</div>
        </div>
        <oda-ace-editor class="flex ace" :value="cell?.source" highlight-active-line="false" show-print-margin="false" :theme="!readOnly&&editedCell===cell?'solarized_light':'dawn'" min-lines=1 :read-only="isReadOnly"></oda-ace-editor>
    `,
    cell: {},
    listeners: {
        change(e) {
            this.cell.source = this.$('oda-ace-editor').value;
        },
        dblclick(e) {
            this.editedCell = this.editedCell === this.cell ? undefined : this.cell;
        }
    },
    get isReadOnly() {
        if (this.cell?.cell_props?.editable) return false;
        if (this.cell?.cell_props?.editable === false) return true;
        return this.editedCell !== this.cell || this.readOnly;
    }
})