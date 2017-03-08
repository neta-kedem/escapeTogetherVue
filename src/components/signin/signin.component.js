import {mapGetters, mapMutations} from 'vuex';
import authService from '../../services/auth.service';
import {SIGN_IN, SIGN_OUT} from '../../modules/auth/auth.module';
import {MY_GENDER, PREF_GENDER, NICKNAME} from '../../modules/escapeTogether/escapeTogether.module';

export default  {
	data: () => {
		return {
			questionNum:0,
			initialScreenHeight: screen.height,
			swipeIn:'swipeIn',
			// myGender: '',
			// prefGender: '',
			localnickName:''
		}
	},
	watch:{
		localnickName(){
			this.setNickName(this.localnickName);
		}
	},
	methods: {
		...mapMutations({
            setMyGender		: MY_GENDER,
            setPrefGender	: PREF_GENDER,
            setNickName		: NICKNAME,
        }),
		changeQuestion(step){
			let tmpQuestionNum = this.questionNum + step;
			if(tmpQuestionNum < 0 ) return;
			if(tmpQuestionNum > 3 ) return;

			if(step === -1) this.swipeIn = 'swipeOut';
			if(step === 1) this.swipeIn = 'swipeIn';
			this.questionNum = tmpQuestionNum;
		},
		onSwipe(event){
			console.log('onSwipe:');
			if(event.additionalEvent === 'panleft') this.changeQuestion(1);
			if(event.additionalEvent === 'panright') this.changeQuestion(-1);
		},
		chooseGender(subject, gender){
			if(subject==='myGender') this.setMyGender(gender);
			if(subject==='prefGender') this.setPrefGender(gender);
		},
		lockMe(){
			this.$router.push('/game');
		},
	},
	mounted(){
		
	},
	computed:{
		...mapGetters([
          'myGender',
          'prefGender',
          'nickName',
        ]),
		amIMale(){
			return (this.myGender === 'man');
		},
		amIWoman(){
			return (this.myGender === 'woman');
		},
		areUMan(){
			return (this.prefGender === 'man');
		},
		areUWoman(){
			return (this.prefGender === 'woman');
		},
		hideBack(){
			return (this.questionNum)? 'visible': 'hidden';  
		},
		hideNext(){
			return (this.questionNum !== 3)? 'visible': 'hidden';  
		},
		enableNextQues(){
			switch(this.questionNum){
				case 0:{
					return !this.myGender;
				}
				case 1:{
					return !this.prefGender;
				}
				case 2:{
					return !this.nickName;
				}
			}
		},
		visibilityEnableNextQues(){
			return this.enableNextQues? 'hidden': 'visible';
		}
	}
}


