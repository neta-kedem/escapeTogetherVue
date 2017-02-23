import {mapGetters, mapMutations} from 'vuex';
import authService from '../../services/auth.service';
import {MODAL_SRC, OPEN_MODAL, CLOSE_MODAL, SET_HOT_SPOTS} from '../../modules/escapeTogether/escapeTogether.module';

import Vue from 'vue';
const JSON_URL = '/gameData';
import io from 'socket.io-client';
const SERVER_URL='http://'+window.location.hostname+':3003';
import FixedPhoto from '../staticScene';
import BagComponent from '../bag';

export default {
    data:() =>{
        return {
            view:null,
            socket:null,
            isPannellumOnLoadActive: false
        }
    },
    methods: {
        ...mapMutations({
            modalSrc:MODAL_SRC,
            openModal:OPEN_MODAL,
            closeModal:CLOSE_MODAL,
            setHotSpotd:SET_HOT_SPOTS,

        }),
        // checkout() {
          // if( !authService.isLoggedIn() ) {
            // this.$router.push({ name: 'signin' });
            // return;
          // }
          // this.$store.dispatch('checkout');
        // }
        loadPannellum(elId){
            // console.log('start loading');

            return Vue.http.get(SERVER_URL + JSON_URL).then((res) => {
                // console.log('res:',res);
                this.view = pannellum.viewer(elId, eval('(' + res.body + ')'));
                // console.log('getting scenes:');
            });
        },
        start(){
            console.log('starting:');
            this.socket = io(SERVER_URL+'/game',{query:{userId:localStorage.getItem('escapeTogetherUserId')}});
            this.socket.on('message',(msg)=>{
                if (msg.userId === this._userId){
                    let b = document.querySelector('.pnlm-title-box');
                    if (!(b.childElementCount && b.children[b.childElementCount-1].textContent === msg.message)){
                        let now=Date.now();
                        b.innerHTML += '<div id="msg'+now +'">' + msg.message + '</div>';
                        setTimeout(()=> {document.querySelector('#msg'+now).remove()},2000);
                    }
                }
            });
            this.socket.on('sound',(msg)=>{
                if (msg.userId === this._userId) {
                    console.log('soundy sound:');
                }
            });
            this.socket.on('state update', (msg)=>{
                // console.log('state updated:', msg);

                if(msg.hasOwnProperty('userId')){
                    this._userId = msg.userId;
                    this.modals = msg.modals;
                    localStorage.setItem('escapeTogetherUserId', msg.userId);
                }
                this._bags = msg.bags;

                const scene = msg.players[this._userId].currScene;
                this._scenes = msg.scenes;
                if(this._currScene !== scene){
                    this._currScene = scene;
                    console.log('changingScene', msg);
                    //we have a modal scene
                    if(this.modals.hasOwnProperty(scene)){
                        this.modalSrc(this.modals[scene].modalSrc);
                        // this.modalSrc = this.modals[scene].modalSrc;
                        this.setHotSpotd(msg.scenes[scene]);
                        this.openModal();
                    }
                    //in case of a normal scene
                    else{
                        this.closeModal();
                        //this.view = this.view.loadScene(scene, 0, 0, 100);
                        // 'same' means scene default pitch/yaw/hfow from config.json
                        //if (!localStorage.xxx)this.view = 
                        this.view.loadScene(scene, 'same', 'same', 'same');
                        //another method (preserving current pitch/yaw/hfow)
                        //else {console.log(scene, this.view.getPitch(), this.view.getYaw(), this.view.getHfov());
                        //  this.view = this.view.loadScene(scene, this.view.getPitch(), this.view.getYaw(), this.view.getHfov());
                        //}
                        //console.log(this.view);

                        this.activatePannellumOnLoad();
                    }
                }
                msg.scenes[scene].forEach((artifact)=>{
                    let hsHtml=(document.querySelector('#'+artifact.id));
                    if(hsHtml) hsHtml.style.display = artifact.shown? 'block': 'none';
                    else console.warn('#' + artifact.id+ ' not found in DOM');
                });
            });
        },
        activatePannellumOnLoad(){
            if (!this.isPannellumOnLoadActive){
                this.isPannellumOnLoadActive = true;
                this.view.on('load', ()=>{
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
            // console.log('user click:', artifactId);
        }
    },
    computed: {

    ...mapGetters([
      'showModal',
    ]),
    },
    mounted() {
        let prmLoaded = this.loadPannellum('panorama');
        prmLoaded.then(()=>{
            // console.log('loading pannellum!');
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
