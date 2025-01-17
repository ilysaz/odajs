const CONTAINERS = ODA.regTool('containers')
const path = import.meta.url.split('/').slice(0,-1).join('/')
const res = await ODA.loadJSON(path + '/_.dir');
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
            if (hostProps?.parent?._isShow) return;
            await import(path + '/' + id + '/' + id + '.js');
            const host = await ODA.createComponent('oda-' + id, hostProps);
            host.style.visibility = 'hidden';

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
            ctrl.style.visibility = 'hidden';
            ctrl.assignProps(props);
            hostProps?.parent && (hostProps.parent._isShow = true);
            host.isContainer = true;
            host.style.position = 'fixed';
            host.style.width = host.style.height = host.style.maxWidth = host.style.maxHeight = '100%';
            ctrl.containerHost = host;
            host.appendChild(ctrl);
            document.body.appendChild(host);
            setTimeout(()=>{
                ctrl.style.visibility = 'visible';
                host.style.visibility = 'visible';
            }, 100)

            const resolveEvent = hostProps?.resolveEvent || 'ok'
            let onMouseDown, onKeyDown, onCancel, onOk;
            const result = new Promise((resolve, reject) => {
                onMouseDown = (e) => { //todo надо отработать общее закрытие
                    e.stopPropagation();
                    if (hostProps.parent){
                        if (e.composedPath().includes(hostProps.parent))
                            return;
                        // if (e.target instanceof Node && hostProps.parent.contains(e.target))
                        //     return;
                        // const pos = hostProps.parent.getBoundingClientRect();
                        // if (pos.left < e.pageX && pos.right > e.pageX && pos.top < e.pageY && pos.bottom > e.pageY)
                        //     return;
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
                        //  if (ctrl.contains(e.target)) return;
                    }

                    // if (host !== document.body.lastChild)
                    //     return;
                    reject(e);
                    // setTimeout(()=>{
                    //     if(!document.body.lastChild?.isContainer) return;
                    //     window.dispatchEvent(new PointerEvent('pointerdown', e));
                    // })
                }
                onKeyDown = (e) => {
                    if (e.keyCode === 27)
                        onCancel();
                }
                onCancel = (e) => {
                    reject();
                }
                onOk = (e) => {
                    setTimeout(() => resolve(ctrl));
                }
                ctrl.addEventListener('close', onCancel);
                ctrl.addEventListener('cancel', onCancel);
                ctrl.addEventListener(resolveEvent, onOk);
                host.addEventListener('close', onCancel);
                host.addEventListener('cancel', onCancel);
                host.addEventListener(resolveEvent, onOk);
                host.style.zIndex = 10000;
                host.addEventListener('pointerdown', onMouseDown);

                window.addEventListener('keydown', onKeyDown);
                top.addEventListener('pointerdown', onCancel);
                if (hostProps.parent)
                    hostProps.parent.addEventListener('pointerdown', onMouseDown);
                if (!hostProps.onResizeDisable)
                    window.addEventListener('resize', onCancel);


            });
            result.finally(() => {
                if (ctrl.slotProxy) {
                    ctrl.slot = ctrl.slotProxy.$slot;
                    ctrl.slotProxy.parentElement.replaceChild(ctrl, ctrl.slotProxy);
                }
                host.removeEventListener('close', onCancel);
                host.removeEventListener('cancel', onCancel);
                host.removeEventListener(resolveEvent, onOk);
                ctrl.removeEventListener('close', onCancel);
                ctrl.removeEventListener('cancel', onCancel);
                ctrl.removeEventListener(resolveEvent, onOk);
                window.removeEventListener('keydown', onKeyDown);
                top.removeEventListener('pointerdown', onCancel);
                if (hostProps.parent) {
                    hostProps.parent._isShow = false
                    hostProps.parent.removeEventListener('pointerdown', onMouseDown);
                }
                if (!hostProps.onResizeDisable)
                    window.removeEventListener('resize', onCancel);
                host.removeEventListener('pointerdown', onMouseDown);
                //todo removeEvents для ctrl
                host.remove();
            })
            return result;
        }
    }
// const res = await ODA.loadJSON(path + '/_.dir');
export default CONTAINERS