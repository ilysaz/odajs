ODA({ is: 'oda-minesweeper',
    template: /*html*/`
        <style>
            :host{
                @apply --vertical;
                position: relative;
            }
        </style>
        <oda-minesweeper-title></oda-minesweeper-title>
        <oda-minesweeper-field class="flex center" style="margin-top: 64px; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);"></oda-minesweeper-field>
    `,
    get game() {
        return this;
    },
    attached() {
        this.init();
    },

    props: {
        iconSize: {
            default: 48,
            save: true
        },
        colors: ['', 'blue', 'green', 'red', 'magenta'],
        cols: {
            default: 10,
            save: true
        },
        rows: {
            default: 10,
            save: true
        },
        mineCount: {
            default: 20,
            save: true
        },
        babyMode: {
            default: false,
            save: true
        },
        borderWidth: 1
    },
    model: [],
    init() {
        this.rows = this.rows < 3 ? 3 : this.rows;
        this.cols = this.cols < 3 ? 3 : this.cols;
        this.mineCount = this.mineCount < 1 ? 1 : this.mineCount > (this.rows * this.cols) / 5 ? (this.rows * this.cols) / 5 : this.mineCount;
        this.mineCount = Math.floor(this.mineCount);
        const model = [];
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                model.push({ x, y })
            }
        }
        for (let i = 0; i < this.mineCount; i++) {
            let pos;
            do {
                pos = Math.floor(Math.random() * model.length);
            } while (model[pos].mine);
            model[pos].mine = true;
        }
        this.model = model;
    },
    bang() {
        this.model.forEach(i => {
            i.status = (i.mine ? 'bang' : 'opened');
        })
    }
})

ODA({ is: 'oda-minesweeper-title', imports: '@oda/button',
    template:/*html*/`
        <style>
            :host {
                display: flex;
                position: absolute;
                top: 0;
                max-width: 100%;
                min-width: 100%;
                align-items: center;
                border-bottom: 1px solid lightgray;
                padding: 2px;
                z-index: 9;
                max-height: 44px;
                overflow: hidden;
                box-sizing: border-box;
            }
        </style>
        <oda-button icon="icons:remove" icon-size=24 @tap="--rows;_init()"></oda-button><div class="txt" title="rows">{{rows}}</div><oda-button icon="icons:add" icon-size=24  @tap="++rows;_init()"></oda-button>
        <oda-button icon="icons:remove" icon-size=24 @tap="--cols;_init()" style="margin-left: 8px"></oda-button><div class="txt" title="columns">{{cols}}</div><oda-button icon="icons:add" icon-size=24  @tap="++cols;_init()"></oda-button>
        <div class="txt horizontal center" style="width: 100%; ">oda-minesweeper</div>
        <oda-button icon="icons:face" icon-size=24 @tap="babyMode = !babyMode" title="baby mode" allow-toggled :toggled="babyMode"></oda-button>
        <oda-button icon="icons:remove" icon-size=24 @tap="--mineCount;_init()"></oda-button><div class="txt" title="level">{{mineCount}}</div><oda-button icon="icons:add" icon-size=24  @tap="++mineCount;_init()"></oda-button>
        <oda-button icon="icons:refresh" icon-size=24 @tap="document.location.reload()" title="refresh" style="margin-right: 8px"></oda-button>
    `,
    _init() {
        this.domHost.init();
    }
})

ODA({ is: 'oda-minesweeper-field',
    template: /*html*/`
        <style>
            :host {
                flex-wrap: wrap;
                width: {{iconSize * cols}}px;
                @apply --horizontal;
                @apply --header;
            }
        </style>
        <div ~for="(row, rowIdx) in rows" class="horizontal flex">
            <oda-minesweeper-mine class="no-flex" :icon-size ~for="(col, colIdx) in cols" :mine="model.find(i=>(i.y === rowIdx && i.x === colIdx))" ~style="{width: iconSize+'px', height: iconSize+'px'}"></oda-minesweeper-mine>
        </div>
    `
})

ODA({ is: 'oda-minesweeper-mine', imports: '@oda/icon',
    template: /*html*/`
        <style>
            :host{
                position: relative;
                align-items: center;
                outline: 1px dotted white;
                @apply --horizontal;
            }
            .btn{
                width: 100%;
                height: 100%;
                align-items: center;
                z-index: 1;
                opacity: {{babyMode ? .8 : 1}};
                outline: lightgray solid {{borderWidth}}px;
                @apply --border;
            }
            .floor{
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0px;
                top: 0px;
                text-align: center;
                font-size: x-large;
                align-items: center;
                font-weight: bolder;
                
            }
        </style>
        <div ~if="count !== 0" class="horizontal floor">
            <span class="flex" ~style="{color: colors[count]}">{{count}}</span>
        </div>
        <button :error="mine?.error && 'bang!!!'" class="flex vertical btn" style="padding: 0px;" ~if="mine?.status !== 'opened'" @tap="onTap" @down="onDown" :icon :icon-size>
            <oda-icon class="flex" :icon :icon-size="iconSize*.5"></oda-icon>
        </button>
    `,
    set mine(n) {
        if (n)
            n.el = this;
    },
    get count() {
        if (this.mine.mine) return ''
        let count = 0;
        for (let x = (this.mine.x - 1); x <= (this.mine.x + 1); x++) {
            for (let y = (this.mine.y - 1); y <= (this.mine.y + 1); y++) {
                const item = this.model.find(i => (i.y === y && i.x === x))
                if (!item) continue;
                if (item === this.mine) continue;
                if (!item.mine) continue;
                count++;
            }
        }
        return count;
    },
    get icon() {
        switch (this.mine?.status) {
            case 'opened':
                return 'odant:spin';
            case 'locked':
                return 'icons:block';
            case 'bang':
                return 'icons:error';
        }
        return ' ';
    },
    onDown(e) {
        if (e.detail.sourceEvent.button > 0) {
            if (this.mine.status !== 'locked')
                this.mine.status = 'locked';
            else
                this.mine.status = '';
        }
    },
    onTap(e) {
        if (this.mine.status === 'locked')
            return;
        if (this.mine.mine) {
            this.mine.error = true;
            this.game.bang();
        }
        else
            this.open();
    },
    open() {
        if (this.mine.status === 'opened') return;
        if (this.mine.mine) return;
        this.mine.status = 'opened';
        if (this.count === 0) {
            for (let x = (this.mine.x - 1); x <= (this.mine.x + 1); x++) {
                for (let y = (this.mine.y - 1); y <= (this.mine.y + 1); y++) {
                    const item = this.model.find(i => (i.y === y && i.x === x))
                    if (!item) continue;
                    if (item === this.mine) continue;
                    item.el.open();
                }
            }
        }
    }
})
