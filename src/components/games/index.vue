<template lang="html">
    <div class="gameScene" v-if="playGame">
        <div style="overflow:hidden;position:relative;" v-html="gameHtml" :style="gameCSS">
            <!-- <img class="staticImage" :src="modalSrc" alt="a modal"> -->
        </div>
        <img v-for="hotSpot in modalHotSpots" class="imageHotSpot" :style="makeStyle(hotSpot)" :src="hotSpot.imgSrc" :id="hotSpot.id" @click="clickHotSpot(hotSpot.id)" v-show="hotSpot.shown">
    </div>
</template>

<script lang="js">
import {mapGetters, mapMutations}   from 'vuex';
import {OPEN_GAME, CLOSE_GAME}      from '../../modules/escapeTogether/escapeTogether.module';

export default {
    name: 'games',
    data() {
        return {
        }
    },
    methods: {
        ...mapMutations({
        }),
        makeStyle(hotSpot) {
            console.log('makeStyle:',hotSpot);
            return {
                "position":     "absolute",
                "top":          hotSpot.top,
                "left":         hotSpot.left,
                "max-width":    hotSpot.width,
                "max-height":   hotSpot.height,
                "min-width":    hotSpot.width,
                "min-height":   hotSpot.height
            };
        },
        clickHotSpot(hotSpotId){
            window.postMessage(hotSpotId,'*');
        }
    },
    computed: {
        ...mapGetters([
            'playGame',
            'gameCode',
            'gameHtml',
            'gameCSS',
            'modalHotSpots'
        ]),
    },
    mounted(){
        eval(this.gameCode);
    }
}
</script>

<style scoped lang="scss">
.gameScene{
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
    background-color: darkblue;
    margin: auto;
}
.staticImage{
    max-width: 100%;
    max-height: 100%;
    top: 0;  
    bottom: 0;  
    left: 0;  
    right: 0;  
    margin: auto;
}
</style>
