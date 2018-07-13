isc.BaseWindow.create({
	ID: "ImageProcessWindow", 
	title: "Image preprocessing window",
	caller: null,

	show: function () {
		this.setPosition();
		
		if (!this.items) {
			this.items = [
				isc.Img.create({
					ID: "imgCanv",
					border: "1px solid green",
					width: "100%", height: "100%",
					imageType: "normal",
					children: [
						isc.DrawPane.create({
							ID: "drCanv",
							border: "1px solid blue",
							width: "100%", height: "100%",
							imageType: "normal"
						})
					]
				}),
				
				isc.HLayout.create({ 
					members: [
						isc.DynamicForm.create({
							autoDraw: false,
							//ID: "uploadForm", 
							width: 80,
							fields: [
								{ name: "image", type: "imageFile", canEdit: true, showFileInline: true, downloadIconSrc: "new.png",
									changed: function(form, item){
										if (item.uploadItem._dataElement.files && item.uploadItem._dataElement.files[0]) {
											var reader = new FileReader();
											reader.onload = function(e) {
                        // Set image 
                        ImageProcessWindow.updateImage(e.target.result);
												}
											
											reader.readAsDataURL(item.uploadItem._dataElement.files[0]);
										}
									} 
								}
							]
						}),
						
						isc.Button.create({Id: "btnCrop", title:"Готово",
							click: function(){
								var topWind = this.topElement;
								var sizeIndexX = imgCanv.currImg.width / (imgCanv.width - 0);
								var sizeIndexY = imgCanv.currImg.height / (imgCanv.height - 0);
								var sizeIndex = sizeIndexY > sizeIndexX ? sizeIndexY : sizeIndexX;
								topWind.crop(imgCanv.currImg, 
								choiceArea.left * sizeIndex, choiceArea.top * sizeIndex, choiceArea.width * sizeIndex, choiceArea.height * sizeIndex, 
								//topWind.deployCroped, 
								topWind.caller.setBlob, // <<< Method that accepts resultsof image processing
								topWind);
								this.topElement.close();
							}
						})
					]
				})
			]
		}
		
		this.Super("show", arguments);
		
	},

	setImage: function() {
		if (this.caller){
			// Set image 
			var img = this.caller.getFile();
			
			this.updateImage(img);
		}
	},

	updateImage: function(img) {
		// Set image 
		imgCanv.setSrc(img);
		imgCanv.currImg = new Image();
		imgCanv.currImg.src = imgCanv.src;
		
		// Adjust image size to adopt to window size 
		var canvasRate = imgCanv.width / imgCanv.height;
		var imageRate = imgCanv.currImg.width / imgCanv.currImg.height;
		if (canvasRate < imageRate) {
			imgCanv.setProperty("imageWidth", imgCanv.width - 1);
      imgCanv.setProperty("imageHeight", null);
		} else {
			imgCanv.setProperty("imageHeight", imgCanv.height - 1);
      imgCanv.setProperty("imageWidth", null);
		}

		// Drav selective rectangle
		isc.DrawRect.create({
			ID: "choiceArea",
			left: 0, top: 0,
			width: 200, height: 150,
			//width: imgCanv.width - 40, height: imgCanv.height - 40,
			title: isc.CBMStrings.Image_PartSelectorTitle,
			lineColor: "#88FFFF"
			}, {
				autoDraw: true,
				canDrag: true,
				drawPane: drCanv,
				titleRotationMode: "neverRotate",
				canResize: true
			});
		choiceArea.showKnobs(["resize"]);
	},

	
	crop: function(canvas, offsetX, offsetY, width, height, callback, topWind) {
		// create an in-memory canvas
		var buffer = document.createElement('canvas');
		var b_ctx = buffer.getContext('2d');
		// set its width/height to the required ones
		buffer.width = width;
		buffer.height = height;
		// draw the main canvas on our buffer one
		b_ctx.drawImage(canvas, offsetX, offsetY, width, height,
						0, 0, buffer.width, buffer.height);
		// now call the callback with the dataURL of our buffer canvas
		// We call it twice - first to supply isc.Img with appropriate base64 encoded image,
		// and for the second time - to return result as Blob for upload purposes
    var callerThumbnailImg = this.caller.members[0];
    var callbackBound = callback.bind(callerThumbnailImg);
    callbackBound(buffer.toDataURL()); 
    buffer.toBlob(callbackBound,'image/jpeg', 0.95);
	}

});
 
