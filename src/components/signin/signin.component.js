import authService from '../../services/auth.service';
import {SIGN_IN, SIGN_OUT} from '../../modules/auth/auth.module';
import io from 'socket.io-client';
// import socket from '../../main.js';




export default  {
	data: () => {
		return {
			questionNum:0,
			initialScreenHeight: screen.height,
			swipeIn:'swipeIn',
			myGender: '',
			prefGender: '',
			nickName:''
		}
	},
	methods: {
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
		chooseGender(subject, gender, el){
			this[subject] = gender;
		},
		lockMe(){
			window.socket = io(window.location.hostname+':3050'+'/game',{query:{userId:localStorage.getItem('escapeTogetherUserId'),
																				myGender:this.myGender,
																				prefGender:this.prefGender,
																				userName:this.nickName}});
			this.$router.push('/game');
		},

		// signin( user ) {
		//   this.$validator.validateAll();
		//   if( this.errors.any() ) return;

		//   authService.signin(user).then(res => {
		//     this.$store.commit(SIGN_IN, res);
		//     this.$router.go(-1);
		//   }).catch(err => {
		//     err.json().then(res => this.error = res.error);
		//   })

		// }
	},
	mounted(){
		
	},
	computed:{
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


