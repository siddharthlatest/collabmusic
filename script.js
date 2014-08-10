function SoundCtrl($scope){
	$scope.sounds = [
		{
			label: 'Sound 1',
			playing: false
		}, {
			label: 'Sound 2',
			playing: false
		}, {
			label: 'Sound 3',
			playing: false
		}, {
			label: 'Sound 4',
			playing: false
		}
	];

	$scope.toggleSound = function(sObj, index){
		index++;
		var sound = new Audio('sounds/' + index + '.ogg');
		sObj.handler = function(){
			sound.currentTime= 0;
			sound.play();
		};
		sObj.stop = function(){
			sound.removeEventListener('ended', this.handler);
		};
		if(!sObj.playing){
			sObj.playing = true;
			var obj = {};
			obj[index] = sObj.playing;
			$scope.abref.setData(obj, function(err, result) {
				console.log("setting data")
				console.log(result)
			});
			sound.addEventListener('ended', sObj.handler, false);
			sound.play();
		} else {
			sObj.stop();
			sObj.playing = false;
			var obj = {};
			obj[index] = sObj.playing;
			$scope.abref.setData(obj, function(err, result) {})
		}
		
	};

	angular.element(document).ready(function(){
		var registered = Appbase.setApp("aphrodite", 1)
		Appbase.new("Sound/random", function(err, result) {
			if (!err) {
				$scope.abref = result
				$scope.abref.on("properties", function(err, abref, snapShot) {
					var properties = snapShot.properties();
					for(property in properties){
						var number = parseInt(property);
						if(number > 0 && number < 5){
							number--;
							$scope.sounds[number].playing = properties[property];
							
						}
					}
					console.log("listening here")
					console.log(snapShot)
					console.log(snapShot.properties())

				})
			}
		})
	});

}