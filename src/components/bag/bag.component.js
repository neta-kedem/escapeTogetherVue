import {mapGetters, mapMutations} from 'vuex';

export default {
    data: () => {
        return {
            items: []
        }
    },
    methods: {
    	bagClicked(artifactId){
        	window.socket.emit('bagedArtifactClicked', artifactId);
        }
    },
    computed: {
        ...mapGetters([
            'bags',
            'userId',
            'socket',
        ]),
        
        // usedByOthers(artifact, userId){
		// 	return ((artifact.beingUsedBy !== -1) && (artifact.beingUsedBy !== userId) );
		// }
    },
}