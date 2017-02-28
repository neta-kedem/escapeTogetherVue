import {mapGetters, mapMutations} from 'vuex';
import authService from '../../services/auth.service';
import {MODAL_SRC, OPEN_MODAL, CLOSE_MODAL, SET_HOT_SPOTS, SET_BAGS, SET_USER_ID, START_SOCKET_IO} from '../../modules/escapeTogether/escapeTogether.module';

import Vue from 'vue';
const JSON_URL = 'gameData';
import FixedPhoto from '../staticScene';
import BagComponent from '../bag';

export default {
    data:() =>{
        return {
            view:null,
            isPannellumOnLoadActive: false,
            _currScene:''
        }
    },
    methods: {
        ...mapMutations({
            modalSrc:       MODAL_SRC,
            openModal:      OPEN_MODAL,
            closeModal:     CLOSE_MODAL,
            setHotSpots:    SET_HOT_SPOTS,
            setBags:        SET_BAGS,
            setUserId:      SET_USER_ID,
        }),
        // checkout() {
          // if( !authService.isLoggedIn() ) {
            // this.$router.push({ name: 'signin' });
            // return;
          // }
          // this.$store.dispatch('checkout');
        // }
        loadPannellum(elId){
            return Vue.http.get(JSON_URL).then((res) => {
                this.view = pannellum.viewer(elId, eval('(' + res.body + ')'));
            });
        },
        activatePannellumOnLoad(){
            if (!this.isPannellumOnLoadActive){
                this.isPannellumOnLoadActive = true;
                this.view.on('load', ()=>{
                    console.log('this:',this);
                    console.warn('load event fired to ',this._currScene);
                    this._scenes[this._currScene].forEach((artifact)=>{
                        let hsHtml=(document.querySelector('#'+artifact.id));
                        if(hsHtml) hsHtml.style.display = artifact.shown? 'block': 'none';
                        else console.warn('#' + artifact.id+ ' not found in DOM in if');
                    });
                });
            }
        },
        artifactClicked(artifactId) {
            this.socket.emit('userClick', artifactId);
            console.log('user click:', artifactId);
        },
        start(){
            console.log('start');
            this.socket.on('message',(msg)=>{
                console.log('msg:',msg);
                if (msg.userId === this.userId){
                    let b = document.querySelector('.pnlm-title-box');
                    if (!(b.childElementCount && b.children[b.childElementCount-1].textContent === msg.message)){
                        let now=Date.now();
                        b.innerHTML += '<div id="msg'+now +'">' + msg.message + '</div>';
                        setTimeout(()=> {document.querySelector('#msg'+now).remove()},2000);
                    }
                }
            });
            // this.socket.on('sound',(msg)=>{
            //     if (msg.userId === this.userId) {
            //         console.log('soundy sound:');
            //     }
            // });
            this.socket.on('state update', (msg)=>{
                console.log('msg update:',msg);
                console.log('_currScene',this._currScene);
                if(msg.hasOwnProperty('userId')){
                    this.setUserId(msg.userId);
                    this.modals = msg.modals;
                    localStorage.setItem('escapeTogetherUserId', msg.userId);
                }
                this.setBags(msg.bags);

                const scene = msg.players[this.userId].currScene;
                this._scenes = msg.scenes;
                if(this._currScene !== scene){
                    this._currScene = scene;
                    console.log('changingScene', msg);
                    //we have a modal scene
                    if(this.modals && this.modals.hasOwnProperty(scene)){
                        console.log('_currScene in if',this._currScene);

                        this.modalSrc(this.modals[scene].modalSrc);
                        // this.modalSrc = this.modals[scene].modalSrc;
                        this.setHotSpots(msg.scenes[scene]);
                        this.openModal();
                    }
                    //in case of a normal scene
                    else{
                        this.closeModal();

                        console.log('_currScene in else',this._currScene);
                        //this.view = this.view.loadScene(scene, 0, 0, 100);
                        // 'same' means scene default pitch/yaw/hfow from config.json
                        //if (!localStorage.xxx)this.view = 
                        this.view.loadScene(scene, 'same', 'same', 'same');
                        //another method (preserving current pitch/yaw/hfow)
                        //else {console.log(scene, this.view.getPitch(), this.view.getYaw(), this.view.getHfov());
                        //  this.view = this.view.loadScene(scene, this.view.getPitch(), this.view.getYaw(), this.view.getHfov());
                        //}

                        this.activatePannellumOnLoad();
                    }
                }
                msg.scenes[scene].forEach((artifact)=>{
                    let hsHtml=(document.querySelector('#'+artifact.id));
                    if(hsHtml) hsHtml.style.display = artifact.shown? 'block': 'none';
                    else console.warn('#' + artifact.id+ ' not found in DOM');
                });
            });
        }

    },
    computed: {
        ...mapGetters([
          'showModal',
          'userId',
          'socket',
        ]),
    },
    mounted() {
        let prmLoaded = this.loadPannellum('panorama');
        prmLoaded.then(()=>{
            this.start();
        });
        window.addEventListener('message' , (msg)=>{
            // console.log('on message', msg.data);
            this.artifactClicked(msg.data);
        });
    },
    watch:{
        showModal(){
            console.log('this.showModal:',this.showModal);
        }
    },
    components: {
        FixedPhoto,
        BagComponent
    }

}
