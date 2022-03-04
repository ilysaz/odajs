ODA({is: 'oda-modal', imports: '@oda/button, @oda/title',
    template: /*html*/`
    <style>
        :host {
            justify-content: center;
            position: relative;
            z-index: 100;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: auto;
            @apply --vertical;  
            animation: fadin 5s ease-in-out;
            background-color: rgba(0, 0, 0, 0.4);
        }
        ::slotted(*) {
            @apply --flex;
        }
        :host > div {
            animation: scale {{animation}}ms ease-in-out;
            max-height: {{fullSize?100:80}}vh;
            max-width: {{fullSize?100:80}}%;
        }
        :host > div > div {
            align-items: center;
        }
        @keyframes fadin {
            from {background-color: rgba(0, 0, 0, 0)}
            to {background-color: rgba(0, 0, 0, 0.4)}
        }
        @keyframes scale {
            from {transform:scale(0)}
            to {transform:scale(1)}
        }
        slot {
            overflow: hidden;
        }
    </style>
    <oda-dialog-content class="shadow" :size="fullSize ? 'max' : 'normal'" :autosize :title :icon>
        <slot class="no-flex" name="modal-title" slot="title-bar"></slot>
        <slot @slotchange="_slot" @tap.stop class="content flex vertical" @dblclick.stop></slot>
    </oda-dialog-content>
    `,
    help: '',
    props: {
        autosize: true,
        icon: '',
        title: '',
        fullSize: false,
        animation: 200,
        iconSize: 24,
        borderWidth: 4,
    },
    control: null,
    _slot(e) {
        this.control = this.control || e.target.assignedNodes()?.[0]
    },
    onDown(e) {
        e.stopPropagation();
    },
})
ODA({is: 'oda-dialog-content', extends: 'oda-form-layout', imports: '@oda/form-layout',
    template: /*html*/`<style> :host{ border-radius: 4px; } </style><slot></slot> `,
    modal: true,
    size: 'normal',
    hideMinMax: true,
    props: {
        minHeight() {
            return this.iconSize * 8;
        },
        saveKey() {
            return this.contextItem?.typeName + this.control?.localName;
        },
    },
    _close() {
        this.fire('cancel');
    },
})
ODA({is: 'oda-dialog-message', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
            align-items: center;
            padding: 16px;
            font-size: x-large;
        }
        label {
            padding-left: 16px;
            word-wrap: break-word;
        }
    </style>
    <oda-icon :icon :icon-size></oda-icon>
    <label :html="message"></label>
    `,
    message: '',
    icon: 'icons:info',
    iconSize: 48
})
ODA({is: 'oda-dialog-input',
    template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
            align-items: center;
            padding: 16px;
            font-size: large;
        }
    </style>
    <input class="flex" ::value autofocus :placeholder>
    `,
    value: '',
    placeholder: '',
    attached() {
        this.async(() => {
            this.$$('input')[0].focus();
        }, 100)
    }
})