function SoundCtrl($scope) {
	$scope.sounds = [
		{
			label: 'Accordian',
			playing: false
		}, {
			label: 'Agogo',
			playing: false
		}, {
			label: 'Bass',
			playing: false
		}, {
			label: 'Brass',
			playing: false
		}
	];

	$scope.toggleSound = function(sObj, index) {
		index++;
		console.log("toggle sound is getting called")
		var sound;
		sObj.playing = !sObj.playing; // toggle sound
		sObj.loop = function() {
			if (sObj.playing) {
				if (window.chrome) sound.load()
				else sound.pause()
				sound.play();
			}
		};
		if(sObj.playing) {
			sound = new Audio('sounds/' + index + '.wav');
			sound.play();
			sound.addEventListener('ended', sObj.loop, false);
		} else {
			if (sound) sound.removeEventListener('ended', this.loop);
			sObj.playing = false;
		}
	};

	$scope.setSound = function(sObj, index) {
		// set sound to the Appbase datastore
		var obj = {};
		obj[index+1] = sObj.playing;
		console.log("set sound is being called", sObj.playing, obj)
		$scope.abref.setData(obj);
	}

	angular.element(document).ready(function() {
		var registered = Appbase.credentials("aphrodite", "4d8d0072580912343cd74a09015cd217")
		$scope.abref = Appbase.create("Sound", "jam")
		$scope.abref.on("properties", function(err, abref, snapShot) {
			var properties = snapShot.properties();
			console.log(properties)
			for(property in properties) {
				var number = parseInt(property);
				if(number > 0 && number < 5) {
					number--
					if (properties[property] !== $scope.sounds[number].playing)
						$scope.toggleSound($scope.sounds[number], number)
				}
			}
			$scope.$apply()
		})
	});
}