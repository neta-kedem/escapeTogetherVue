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
        },
        avatarImgUrl(userId){
            return (this.completeMsg.players[userId].gender === 'man')? 'img/avatars/person-flat.png' : 'img/avatars/girl-512.png';
        }
    },
    computed: {
        ...mapGetters([
            'bags',
            'userId',
            'socket',
            'myGender',
            'prefGender',
            'completeMsg'
        ]),
        // usedByOthers(artifact, userId){
		// 	return ((artifact.beingUsedBy !== -1) && (artifact.beingUsedBy !== userId) );
		// }
    },
}