
// Пока сделаю лендинг
import './site-template.js';
ODA({ is: 'oda-site-test', extends: 'oda-css', template: /*html*/ `
    <oda-site-header :css></oda-site-header>
    <oda-site-footer :css></oda-site-footer>
    `,
    props:{
        css:'./default.css',
        sections:[]
    },
});


ODA({ is: 'oda-site-header', extends: 'oda-css', template: /*html*/ `
    <div id='flogo'><img src='svg/logo_platform-min.svg'/></div>
    <slot name='main-menu'></slot>
    `
});


ODA({ is: 'oda-site-footer', extends: 'oda-css', template: /*html*/ `
    <div class='fcontent' ~html='content'></div>
    <div id='soc-menu'>
        <a ~for='socLinck' :href='item?.linck' :title='item?.title'><img :src='item?.img' /></a>
    </div>
    `,
    props: {
        socLinck:[{img:'test-soc/1.png', title:'weChat', linck:'/'},{img:'test-soc/3.png', title:'telegram', linck:'/'},
                    {img:'test-soc/2.png', title:'vk', linck:'/'},{img:'test-soc/4.png', title:'skype', linck:'/'}],
        content: /*html*/  `Copyright © 2015 BusinessInterSoft, <br/> LLC. ODANT® - is a registered trademark of BusinessInterSoft, LLC.`

    }
});