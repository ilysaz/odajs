import "../../oda.js";
const CONTAINERS = ODA.regTool('containers');
const path = import.meta.url.split('/').slice(0,-1).join('/')
ODA.loadJSON(path + '/_.dir').then(res=>{
    CONTAINERS.items = (res || []).map(i => i.name);
    for (let id of CONTAINERS.items) {
        ODA[('close-'+id).toCamelCase()] = function (){
            const dd = document.body.getElementsByTagName('oda-'+id)
            if (dd.length)
                for (let i = 0; i < dd.length; i++) {
                    const elm = dd[i];
                    elm.fire('cancel');
                }
        }
        ODA[('show-' + id).toCamelCase()] = async function (component, props = {}, hostProps = {}, onVisible) {
            await import(path + '/' + id + '/' + id + '.js');
            const host = await ODA.createComponent('oda-' + id, hostProps);
            let ctrl = component;
            if (typeof ctrl === 'string')
                ctrl = await ODA.createComponent(ctrl);
            else { //todo Поверить режим для готовых компонентов
                if (ctrl.parentElement) {
                    if (ctrl.containerHost)
                        ctrl.containerHost.fire('cancel');
                    const comment = document.createComment(ctrl.innerHTML);
                    comment.slotTarget = ctrl;
                    ctrl.slotProxy = comment;
                    ctrl.containerHost = host;
                    comment.$slot = ctrl.slot;
                    delete ctrl.slot;
                    ctrl.parentElement.replaceChild(comment, ctrl);
                }
            }
            for (let i in props) {
                const prop = props[i];
                if (typeof prop === 'function'){
                    ctrl.addEventListener(i, prop.bind(ctrl), true)
                }
                else
                    ctrl[i] = prop
            }
            host.isContainer = true;
            host.style.position = 'fixed';
            host.style.width = '100%';
            host.style.height = '100%';
            ctrl.containerHost = host;
            host.appendChild(ctrl);
            document.body.appendChild(host);

            let onMouseDown, onKeyDown, onCancel, onOk;
            const result = new Promise((resolve, reject) => {
                onMouseDown = (e) => { //todo надо отработать общее закрытие
                     if (hostProps.parent){
                         if (e.path.includes(hostProps.parent))
                             return;
                         if (e.target instanceof Node && hostProps.parent.contains(e.target))
                             return;
                        const pos = hostProps.parent.getBoundingClientRect();
                        if (pos.left < e.pageX && pos.right > e.pageX && pos.top < e.pageY && pos.bottom > e.pageY)
                            return;
                    }
                    if (e.target instanceof Node){
                         if (host.contains(e.target)) {
                             let last = document.body.lastChild;
                             while (last && last.isContainer && last !== host){
                                 last.fire('cancel');
                                 last = last.previousSibling;
                             }
                             return;
                         }
                         if (ctrl.contains(e.target)) return;
                    }

                    if (host !== document.body.lastChild)
                        return;
                    reject(e);
                    setTimeout(()=>{
                        if(!document.body.lastChild?.isContainer) return;
                        window.dispatchEvent(new PointerEvent('pointerdown', e));
                    })
                }
                onKeyDown = (e) => {
                    if (e.keyCode === 27)
                        onCancel(e);
                }
                onCancel = (e) => {
                    reject(e)
                }
                onOk = (e) => {
                    setTimeout(() => resolve(ctrl));
                }
                ctrl.addEventListener('cancel', onCancel);
                ctrl.addEventListener('ok', onOk);
                host.addEventListener('cancel', onCancel);
                host.addEventListener('ok', onOk);
                host.style.zIndex = 10000;
                host.addEventListener('pointerdown', onMouseDown);

                window.addEventListener('keydown', onKeyDown, true);
                window.addEventListener('pointerdown', onMouseDown, true);
                window.addEventListener('resize', onCancel);


            });
            result.finally(() => {
                if (ctrl.slotProxy) {
                    ctrl.slot = ctrl.slotProxy.$slot;
                    ctrl.slotProxy.parentElement.replaceChild(ctrl, ctrl.slotProxy);
                }
                host.removeEventListener('cancel', onCancel);
                host.removeEventListener('ok', onOk);
                ctrl.removeEventListener('cancel', onCancel);
                ctrl.removeEventListener('ok', onOk);
                window.removeEventListener('keydown', onKeyDown, true);
                window.removeEventListener('pointerdown', onMouseDown, true);
                window.removeEventListener('resize', onCancel);
                host.removeEventListener('pointerdown', onMouseDown);
                //todo removeEvents для ctrl
                host.remove();
            })
            return result;
        }
    }
})

export default CONTAINERS