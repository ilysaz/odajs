let files = new Map();
let fileCount = 0;

ODA({ is: 'oda-md-code', imports: '@oda/icon, @oda/ace-editor', template: `
        <style>
            .md { @apply --layout; display: block; padding: 4px; }
            .hljs { @apply --layout; display: block; padding: {{md ? '8px 4px 6px 10px;' : ''}}; height: {{_eh ? _eh + 'px' : ''}} }
            .hljs-comment, .hljs-quote { color: #93a1a1; }
            .hljs-keyword, .hljs-selector-tag, .hljs-addition { color: #859900; }
            .hljs-number, .hljs-string, hljs-meta .hljs-meta-string, .hljs-literal, .hljs-doctag, .hljs-regexp { color: #2aa198; }
            .hljs-title, .hljs-section, .hljs-name, .hljs-selector-id, .hljs-selector-class { color: #268bd2; }
            .hljs-attribute, .hljs-attr, .hljs-variable, .hljs-template-variable, .hljs-class .hljs-title, .hljs-type { color: #b58900; }
            .hljs-symbol, .hljs-bullet, .hljs-subst, .hljs-meta, .hljs-meta .hljs-keyword, .hljs-selector-attr, .hljs-selector-pseudo, .hljs-link { color: #cb4b16; }
            .hljs-built_in, .hljs-deletion { color: #dc322f; }
            .hljs-formula { background: #eee8d5; }
            .hljs-emphasis { font-style: italic; }
            .hljs-strong { font-weight: bold; }
            .hjln { min-width:34px; color:gray; border-right:.1em solid; counter-reset: l; cursor:default; float:left; padding:8px 0; margin:0 0.5em 0 0; text-align:right; -moz-user-select:none; -webkit-user-select:none }
            .hjln span { counter-increment:l; display:block;padding:0 .5em 0 1em }
            .hjln span:before { content:counter(l) }
            .light { background-color: #ddd; display: inline-block;}
            .icon-info { display: flex; }
            .copy:active:before { position: absolute; right: 0; top: -26px; color: red; content:"copied"; }
        </style>
        <pre ~if="pre!=='undefined'" class="hljs" style="display: flex; border: .5px solid lightgray; border-radius: 2px; min-height:32px; background: #FFE5; overflow: auto;">
            <code class="hljs" style="outline: 0px solid transparent; white-space: pre-wrap;">{{pre || ''}}</code>
        </pre>
        <div ~if="!pre || pre==='undefined'" class="flex vertical" ~style="{'margin-left': infpnl?'10px':''}" style=" position: relative;padding:0;color:darkgray">
            <div ~if="showFilename" style="font-size:.8em;position: absolute; top:-4px;left:2px;">{{filename}}</div>
            <div style="cursor:pointer;position: absolute; top:18px;right:4px;display: flex">
                <oda-icon ~if="showRun && showConsole" icon="device:developer-mode" icon-size="16" style="cursor:pointer; z-index: 9;" @tap="_switchConsole" title="show console"></oda-icon>
                <oda-icon class="copy" ~if="bcopy" icon="icons:content-copy" icon-size="16" style="cursor:pointer; z-index: 9;" @tap="_copy"  title="copy to clipboard"></oda-icon>
            </div>
            <pre class="hljs" style="display:flex;border: .5px solid darkgray;border-radius:2px;overflow:auto;overflow-x:auto;min-height:32px"
                    ~style="line? '' : 'white-space:pre-wrap;'+_getColor(true)">
                <oda-icon class="icon-info" ~class="infpnl" ~style="_getColor" :icon="_getInfoIcon" style="position:absolute;left:-11px;top:22px;background:white; border-radius: 50%; z-index: 9"
                        ~if="infpnl && !hideicon" :title="infpnl"></oda-icon>
                <code ~if="md" ref="code" :contenteditable="enableEdit" ~class="md?'md':'hljs'" ~html="html" @input="_changed" style="outline:0px solid transparent;"
                        ~style="md?'font-family:var(--font-family);font-size:.95em':'font-size:1.25em;line-height: 1.3em;'"></code>
                <oda-ace-editor ref="code" :show-gutter="!hideGutter" :read-only="!enableEdit" :show-print-margin="false" ~show="!md" ::value="_code" style="flex: 1; background-color: white" font-size="16" :mode="_mode" @change="_changed" ~style="{'padding-left': hideGutter ? '10px' : '0', 'padding-top': hideGutter ? '16px' : 0 }" highlight-active-line="false" min-lines="1" max-lines="Infinity"></oda-ace-editor>
            </pre>
            <iframe ref="iframe" ~if="showRun" :srcdoc="_src" style="padding: 6px;border-radius:0 0 2px 2px;border: 1px solid darkgray;min-width:0px;height:28px;margin:-14px 0 14px 0"
                    onload="setTimeout(()=>{this.style.height=this?.contentDocument?.body?.scrollHeight+'px'},500)" ~style="{'min-height': (_h||28)+'px','max-height': _h ? _h+'px':'unset'}"></iframe>
            <div ~if="showRun && _showConsole" style="display:flex;margin-top:-14px">
                <div style="font-size:.8em;">console:</div>
                <div style="flex:1"></div>
                <oda-icon icon="files:document" icon-size="12" style="z-index: 9; cursor:pointer;" @tap="_console=''" title="clear"></oda-icon>
                <oda-icon icon="icons:refresh" icon-size="16" style="z-index: 9; cursor:pointer;" @tap="_console='';this._changed(false)" title="refresh"></oda-icon>
                <oda-icon icon="icons:close" icon-size="16" style="z-index: 9; cursor:pointer;" @tap="_switchConsole" title="close"></oda-icon>
            </div>
            <textarea ref="textarea" ~if="showRun && _showConsole" style="background-color:#eee;padding: 2px;border-radius:0 0 2px 2px;border: 1px solid darkgray;min-width:100%;max-width:100%;height:128px;"
                    readonly>{{_console}}</textarea>
        </div>
        `,
    props: {
        html: '',
        pre: '',
        _iframe: '',
        code: {
            type: String,
            set(n) {
                if (n) {
                    this._code = htmlDecode(n);
                    if (this.md) {
                        this.html = globalThis.mdShowdown.makeHtml(this._code).replace(/<p>|<\/p>/g, '');
                    } else {
                        this.html = this._code;
                    }
                }
            }
        },
        _code: '',
        lang: {
            type: String,
            set(n) {
                if (n) {
                    this._lang = n;
                    let lang = '';
                    let langs = ['javascript', 'xml', 'xquery', 'css', 'http', 'ini', 'json', 'html'];
                    langs.forEach(e => {
                        if (this._lang.startsWith(e)) lang = e;
                    });
                    if (!lang) {
                        langs.forEach(e => {
                            if (this._lang.includes(e)) lang = e;
                        });
                    }
                    this._mode = lang;
                    if (this.filename) {
                        this.showFilename = true;
                    } else {
                        fileCount += 1;
                        this.filename = 'file_' + fileCount + this._lang.includes('html') ? '.html' : this._lang.includes('javascript') ? '.js' : '';
                    }
                    this.bcopy = n.includes('copy') && !n.includes('nocopy');
                    this.enableEdit = n.includes('edit');
                    this.showRun = n.includes('run');
                    this.hideicon = n.includes('hideicon');
                    this.hideGutter = n.includes('hideGutter');
                    this.line = n.includes('line');
                    this.md = n.includes('md');
                    this.filename = n.includes('[') && n.includes(']') ? /(?:\[)(.*)(?:\])/g.exec(n)[1] : '';
                    this.components = n.includes('{') && n.includes('}') ? /(?:\{)(.*)(?:\})/g.exec(n)[1].split('_') : [];
                    ['error', 'success', 'info', 'warning', 'help', 'like', 'faq'].forEach(e => {
                        if (this._lang.includes(e)) this.infpnl = e;
                    });
                    this._h = /_h=(.*?)_/g.exec(n) ? /_h=(.*?)_/g.exec(n)[1] : '';
                    this._eh = /_eh=(.*?)_/g.exec(n) ? /_eh=(.*?)_/g.exec(n)[1] : '';
                    this._loadODA = n.includes('loadoda');
                    this.showConsole = n.includes('console');
                    this.warn = n.includes('warn');
                    this.error = n.includes('error');
                    if (this.md) {
                        this.html = globalThis.mdShowdown.makeHtml(this._code).replace(/<p>|<\/p>/g, '');
                    } else {
                        this.html = this._code;
                    }
                }
            }
        },
        hideicon: false,
        hideGutter: false,
        bcopy: true,
        _show: false,
        enableEdit: false,
        showRun: false,
        line: false,
        md: false,
        infpnl: '',
        filename: '',
        showFilename: false,
        components: [],
        _edit: '',
        _lang: '',
        _h: '',
        _eh: '',
        _src: '',
        _loadODA: false,
        showConsole: false,
        _showConsole: false,
        _console: '',
        warn: false,
        error: false,
        _mode: ''
    },
    attached() {
        this.async(() => {
            files.set(this.filename, this._code);
            this._getIframe();
            if (this.components.length) {
                document.addEventListener("iframeChanged", e => {
                    if (this._lang !== e.detail._lang && this.components.includes(e.detail.filename)) {
                        this._changed(false);
                    }
                });
            }
        }, 300);
    },
    _switchConsole() {
        this._showConsole = !this._showConsole;
        if (this._showConsole) this._changed(false);
        else this._console = '';
    },
    _setConsole(e) {
        if (this._showConsole && this.$('iframe')) {
            this.async(() => {
                const _cons = (e) => {
                    if (!this.warn && e.startsWith('console.warn > ')) return;
                    if (!this.error && e.startsWith('console.error > ')) return;
                    this._console += '\r\n' + e;
                    if (this.$refs.textarea) {
                        let textarea = this.$refs.textarea;
                        this.async(() => {
                            textarea.scrollTop = textarea.scrollHeight;
                        });
                    }
                };
                let cons = (function(oldCons) {
                    return {
                        log: function(text) {
                            oldCons.log(text);
                            if (text.toString().startsWith('from alert')) _cons(text);
                            else _cons('console.log > ' + text);
                        },
                        info: function(text) {
                            oldCons.info(text);
                            _cons('console.info > ' + text);
                        },
                        warn: function(text) {
                            oldCons.warn(text);
                            _cons('console.warn > ' + text);
                        },
                        error: function(text) {
                            oldCons.error(text);
                            _cons('console.error > ' + text);
                        }
                    };
                }(this.$refs.iframe.contentWindow.console));
                this.$refs.iframe.contentWindow.console = cons;
            }, 30);
        }
    },
    async _copy() {
        await navigator.clipboard.writeText(this._code);
    },
    _changed(iframeChanged = true) {
        if (!this.$refs.code) return;
        this._edit = this.$refs.code.value || this.$refs.code.innerText || '';
        files.set(this.filename, this._edit);
        this._getIframe();
        if (iframeChanged && this.filename) document.dispatchEvent(new CustomEvent('iframeChanged', { detail: { _lang: this._lang, filename: this.filename } }));
    },
    _getIframe() {
        if (!this.showRun || !this._code) return;
        let css = '';
        let code = files.get(this.filename) && files.get(this.filename);
        if (this.filename.includes('.js') || this._lang.includes('javascript')) {
            if (this.components && this.components.length) {
                for (const c of this.components) {
                    if (c.endsWith('.css')) {
                        css += files.get(c) || '';
                    } else {
                        let v = files.get(c);
                        code = v + code;
                    }
                }
            }
            code = code.replace(/import .*oda.js\'/g, '');
            code = code.replace(/import .*(\'|\")\//g, `import $1${ODA.rootPath}/`);
            code = code.replace(/(<oda-.*=\'|\")\//g, `$1${ODA.rootPath}/`);
            this._iframe =
                `
${css}
${this._scriptODA()}
<script type="module">
${code}
</script>
${this.filename.includes('.js') ? `<${this.filename.replace('.js', '')}></${this.filename.replace('.js', '')}>` : ''}
`;
        } else if (this.filename && this.filename.includes('.html') || this._lang.includes('html')) {
            code = code.replace(/\<script.*src="\//g, `<script type="module" src="${ODA.rootPath}/`);
            code = code.replace(/\<script.*oda.js"\>\<\/script\>/g, this._scriptODA());
            if (this.components && this.components.length) {
                let v = '<script type="module">';
                for (const c of this.components) {
                    if (c.endsWith('.css')) {
                        css += files.get(c) || '';
                    } else {
                        v += files.get(c) && files.get(c);
                    }
                }
                if (!code.includes('/oda.js"></script>')) code = `
${css}
${this._scriptODA()}` + code;
                code += v + '</script>';
            }
            this._iframe = code;
        }
        this._iframe = this._iframe.replace(/alert\(/g, 'console.log("from alert  > " + ');
        this._iframe = `<meta charset="UTF-8">` + this._iframe;
        this._setConsole();
        this._src = this._iframe;
    },
    _getInfoIcon() {
        return {
            'error': 'icons:add-circle-outline:45', 'success': 'enterprise:check-box', 'info': 'icons:info-outline',
            'warning': 'icons:warning', 'help': 'icons:help-outline', 'faq': 'icons:question-answer', 'like': 'shopping:like'
        }[this.infpnl];
    },
    _getColor(left = false) {
        let color = {
            'error': 'red !important', 'success': 'green !important', 'info': 'blueviolet !important',
            'warning': 'orange !important', 'help': 'blue !important', 'faq': 'brown !important', 'like': 'limegreen !important'
        }[this.infpnl];
        if (!color || !this.infpnl) return '';
        if (!left)
            return `fill:${color};border-color:${color}`;
        return `border-left-color:${color};border-left-width:3px`;
    },
    _scriptODA() {
        if (this._loadODA) return `<script type="module" src="${ODA.rootPath + '/oda.js'}"></script>`;
        return `<script type="module" src="${ODA.rootPath + '/oda.js'}"></script>`;
    }
})