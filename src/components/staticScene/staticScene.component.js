import {mapGetters, mapMutations} from 'vuex';
import {OPEN_MODAL} from '../../modules/escapeTogether/escapeTogether.module';
import {CLOSE_MODAL} from '../../modules/escapeTogether/escapeTogether.module';
import {UPDATE_QUANTITY} from '../../modules/escapeTogether/escapeTogether.module';

export default {
    name: 'staticScene',
    // props   : {
    //   product: {
    //     type    : Object,
    //     required: true
    //   }
    // },
    data() {
        return {
        }
    },
    methods: {
        ...mapMutations({
            openModal: OPEN_MODAL,
            closeModal: CLOSE_MODAL
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
        ...mapGetters({
            showModal:      'showModal',
            modalSrc:       'modalSrc',
            modalHotSpots:  'modalHotSpots',
        }),
    },
    mounted(){
    },
    watch:{
    }
}