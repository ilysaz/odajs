
import {sectionsContent} from './content.js';
// Пока сделаю лендинг
import './site-template.js';
ODA({
    is: 'oda-site-test', /*extends: 'oda-css',*/ template: /*html*/ `
    <style>
        :host{width:100%; height: 100%; overflow: scroll;scroll-behavior: smooth;}
        .fix {position:absolute; top:0%;}
        #header {width:100%; background:whitesmoke; border-bottom:2px solid #007fc6;}
        oda-site-header {padding:2% 10%;}
        .fix oda-site-header {padding:5px 10%;}
        .content .secname {background-image:url(h.jpg);background-attachment: fixed;height: 30vh; color: #fff; font-size:10vh ; padding: 0; margin: 0;
        display: grid;align-content: center; justify-content: center; text-shadow: 0 0 2px #000; text-align:center;}
        .menu a {color:#000; text-decoration:none; border-bottom:2px solid #00a0dc; padding: 5px; transition: all 0.5s linear;}     
        .menu a:hover {border-color:#052e70}
        .sactive.menu a {background:#00a0dc; color:white;} 
    </style>
    <div id='header' :class='fixmenu'>
        <oda-site-header :fixmenu ></oda-site-header>
    </div>
    <div ~for='sections' :class='"content "+sectionsActiv[index]' ~ref='"sec"+index'>
        <div ~if='item?.inmenu' :class='"menu "+sectionsActiv[index]' slot='mainmenu'><a @tap='_go(index)' :href='"#sec"+index'>{{item?.inmenu}}</a></div>
        <h2 ~if='item?.header' class='secname'>{{item?.header}}</h2>
        <div ~if='item?.body' class='secbody' ~html='item?.body'></div>
    </div>
    <oda-site-footer ></oda-site-footer>
    `,
    props: {
        // css: './default.css',
        sections: sectionsContent,
        fixmenu: 'nofix',
        sectionsActiv:[]
    },
    listeners: {
        'resize': '_resize',
        'scroll': '_scrol'
    },
    _resize() {
        console.log(this.offsetWidth, this.offsetHeight) 
    },

    _scrol(){
        this.fixmenu = (this.scrollTop > 10) ? 'fix' : 'nofix'
        for (var i=0; i<this.sections.length;i++) {
            let section = this.$refs['sec'+i][0], a = section.offsetTop, b = a + section.offsetHeight, x=this.scrollTop;
            this.sectionsActiv[i] = ((x>a)&(x<b)) ? 'sactive' : ''
            // console.log(((x>a)&(x<b)))
        }
        // this.$refs.forEach((e,i) => {
        //     let a = e.offsetTop, b = a + e.offsetHeight, x=this.scrollTop
        //     ((x>a)&(x<b))? this.sectionsActiv[i]            
        // });
        // console.log(this.scrollTop)
    },
    _go(i) { //console.log(this.$refs)
        this.scrollTop = this.$refs['sec'+i][0].offsetTop     
    }

});


ODA({
    is: 'oda-site-header',/* extends: 'oda-css', */template: /*html*/ `
    <style>
        :host {display:flex;align-items: center; justify-content: space-between; transition: all 0.5s linear;}
        #flogo {width: 20%;}
        #flogo.fix img {height:40px}
        .menu {padding:0 0 0 10px;}
    </style>
    <div id='flogo' :class='fixmenu'><img src='svg/logo_platform-min.svg'/></div>

    <slot name='mainmenu' class='mainmenu'></slot>
    `
});


ODA({
    is: 'oda-site-footer',/* extends: 'oda-css',*/ template: /*html*/ `
    <style>
        :host {height: 350px; border-top:2px solid whitesmoke; box-shadow:  0 -2px 0 0 #007fc6;
    background-image:url(svg/righ-top-ornament-min.svg), linear-gradient(to right, #042e6f, #007fc6)  ;
    background-size: auto 100%; background-repeat: no-repeat; background-position: top right;  
    display: grid; grid-template-columns:1fr 1fr; grid-column-gap: 10%;
    grid-row-gap: 10%; align-items: center; padding: 0 10%; }
        #soc-menu {padding-top: 20% ; text-align: right;}
        #soc-menu a {border: 2px solid transparent; border-radius: 50%; margin-left: 10px; }
        #soc-menu a:hover {border-color: whitesmoke; transition: all 0.5s linear;}
        #soc-menu a img {border: 2px solid white;border-radius: 50%;}

    </style>
    <div class='fcontent' ~html='content'></div>
    <div id='soc-menu'>
        <a ~for='socLinck' :href='item?.linck' :title='item?.title'><img :src='item?.img' /></a>
    </div>
    `,
    props: {
        socLinck: [{ img: 'test-soc/1.png', title: 'weChat', linck: '/' }, { img: 'test-soc/3.png', title: 'telegram', linck: '/' },
        { img: 'test-soc/2.png', title: 'vk', linck: '/' }, { img: 'test-soc/4.png', title: 'skype', linck: '/' }],
        content: /*html*/  `Copyright © 2015 BusinessInterSoft, <br/> LLC. ODANT® - is a registered trademark of BusinessInterSoft, LLC.`

    }
});

