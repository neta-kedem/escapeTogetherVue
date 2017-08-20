import {mapGetters, mapMutations} from 'vuex';
import {MODAL_SRC, OPEN_MODAL, CLOSE_MODAL, SET_HOT_SPOTS, SET_BAGS, SET_USER_ID, OPEN_GAME, CLOSE_GAME, GAME_CODE, GAME_HTML, GAME_CSS, UPDATE_MSG} from '../../modules/escapeTogether/escapeTogether.module';

import Vue from 'vue';
const JSON_URL = 'gameData';
import FixedPhoto from '../staticScene';
import BagComponent from '../bag';
import GamesComponent from '../games';

import io from 'socket.io-client';


export default {
    data:() =>{
        return {
            view:null,
            isPannellumOnLoadActive : false,
            currentScene            :'classroom',
            rippleDivStyle          : {top:'0px', left:'0px;'},
            rippleDivActive         : false,
            clearRippleTimeOut      : [],
            clickTypeFlag           : 0
        }
    },
    methods: {
        ...mapMutations({
            modalSrc    : MODAL_SRC,
            openModal   : OPEN_MODAL,
            closeModal  : CLOSE_MODAL,
            setHotSpots : SET_HOT_SPOTS,
            setBags     : SET_BAGS,
            setUserId   : SET_USER_ID,
            openGame    : OPEN_GAME,
            closeGame   : CLOSE_GAME,
            gameCode    : GAME_CODE,
            gameHtml    : GAME_HTML,
            gameCSS     : GAME_CSS,
            updateMsg     : UPDATE_MSG,
        }),
        loadPannellum(elId){
            return Vue.http.get(JSON_URL).then((res) => {
                this.view = pannellum.viewer(elId, eval('(' + res.body + ')'));
            });
        },
        activatePannellumOnLoad(){
            if (!this.isPannellumOnLoadActive){
                this.isPannellumOnLoadActive = true;
                this.view.on('load', ()=>{
                    console.warn('load event fired to ',this.currentScene);
                    this._scenes[this.currentScene].forEach((artifact)=>{
                        let hsHtml=(document.querySelector('#'+artifact.id));
                        if(hsHtml) hsHtml.style.display = artifact.shown? 'block': 'none';
                        else console.warn('#' + artifact.id+ ' not found in DOM in if');
                    });
                });
            }
        },
        artifactClicked(artifactId) {
            window.socket.emit('userClick', artifactId);
            console.log('user click:', artifactId);
        },
        start(){
            window.socket = io(window.location.hostname+':3050'+'/game',{query:{userId:localStorage.getItem('escapeTogetherUserId'),
                                                                                roomId:localStorage.getItem('escapeTogetherRoomId'),
                                                                                myGender:this.myGender,
                                                                                prefGender:this.prefGender,
                                                                                userName:this.nickName}});
            console.log('start');
            window.socket.on('message',(msg)=>{
                console.log('msg:',msg);
                if (msg.userId === this.userId){
                    let b = document.querySelector('.pnlm-title-box');
                    if (!(b.childElementCount && b.children[b.childElementCount-1].textContent === msg.message)){
                        let now = Date.now();
                        b.innerHTML += '<div id="msg'+now +'">' + msg.message + '</div>';
                        setTimeout(()=> {document.querySelector('#msg'+now).remove()},2000);
                    }
                }
            });
            // window.socket.on('sound',(msg)=>{
            //     if (msg.userId === this.userId) {
            //         console.log('soundy sound:');
            //     }
            // });
            window.socket.on('state update', (msg)=> {
                console.log('msg update:',msg);
                this.updateMsg(msg);
                if(msg.hasOwnProperty('userId')){
                    this.setUserId(msg.userId);
                    this.modals = msg.modals;
                    this.games = msg.games;
                    localStorage.setItem('escapeTogetherUserId', msg.userId);
                    localStorage.setItem('escapeTogetherRoomId', msg.roomId);
                }
                console.log('currentScene',this.currentScene, 'this.userId', this.userId);
                this.setBags(msg.bags);

                const scene = msg.players[this.userId].currScene;
                this._scenes = msg.scenes;
                if(this.currentScene !== scene){
                    this.currentScene = scene;
                    console.log('changingScene', msg);
                    //we have a modal scene
                    if(this.modals && this.modals.hasOwnProperty(scene)){
                        console.log('currentScene in if',this.currentScene);
                        this.modalSrc(this.modals[scene].modalSrc);
                        // this.modalSrc = this.modals[scene].modalSrc;
                        this.setHotSpots(msg.scenes[scene]);
                        this.closeGame();
                        this.openModal();
                    } else if(this.games && this.games[scene] && this.games[scene].gameSrc){
                        console.log('setting hot spots:',msg.scenes[scene]);
                        this.setHotSpots(msg.scenes[scene]);
                        this.$http.get(this.games[scene].gameSrc + '.js').then((jsRes)=>{
                            var reader = new FileReader();
                            reader.readAsText(jsRes.bodyBlob);
                            reader.onload = () => {
                                this.gameCode(reader.result);
                                this.$http.get(this.games[scene].gameSrc + '.html').then((htmlRes)=>{
                                    this.$http.get(this.games[scene].gameSrc + '.css').then((cssRes)=>{
                                        this.gameCSS(cssRes.body);
                                        this.gameHtml(htmlRes.body);
                                        this.closeModal();
                                        this.openGame();
                                    })
                                });
                            };
                        });
                    }
                    //in case of a panoramic scene
                    else{
                        this.closeModal();
                        this.closeGame();
                        console.log('currentScene in else',this.currentScene);
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
        },
        makeRipple(event){
            if(!this.clickTypeFlag){
                this.rippleDivActive = false;
                this.clearRippleTimeOut.forEach((idToDelete)=>{
                    clearTimeout(idToDelete);
                });
                this.clearRippleTimeOut.splice(0, this.clearRippleTimeOut.length);;
                this.rippleDivStyle.top     = event.clientY - 25 + 'px';
                this.rippleDivStyle.left    = event.clientX - 25 + 'px';
                setTimeout(()=>this.rippleDivActive = true),0;

                this.clearRippleTimeOut.push(setTimeout(()=>{
                    console.log('this.clearRippleTimeOut:',this.clearRippleTimeOut);
                    // this.clearRippleTimeOut.forEach((idToDelete)=>{
                        // clearTimeout(idToDelete);
                    // });
                    // this.clearRippleTimeOut.splice(0, this.clearRippleTimeOut.length - 1);;
                    this.rippleDivActive = false;
                }, 1000));
            }
        },
        mouseDown(){
            this.clickTypeFlag = 0;
        },
        mouseMove(){
            this.clickTypeFlag = 1;
        },
    },
    computed: {
        ...mapGetters([
          'showModal',
          'userId',
          'myGender',
          'prefGender',
          'nickName',
          'playGame',
        ]),
    },
    mounted() {
        let prmLoaded = this.loadPannellum('panorama');
        prmLoaded.then(()=>{
            this.start();
        });
        window.addEventListener('message' , (msg)=>{
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
        BagComponent,
        GamesComponent,
    }

}
