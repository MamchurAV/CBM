﻿isc.BaseWindow.create({
	ID: "ImageProcessWindow", 
	title: "Image preprocessing window",
	crop: function(canvas, offsetX, offsetY, width, height, callback) {
	  // create an in-memory canvas
	  var buffer = document.createElement('canvas');
	  var b_ctx = buffer.getContext('2d');
	  // set its width/height to the required ones
	  buffer.width = width;
	  buffer.height = height;
	  // draw the main canvas on our buffer one
	  // drawImage(source, source_X, source_Y, source_Width, source_Height, 
	  //  dest_X, dest_Y, dest_Width, dest_Height)
	  b_ctx.drawImage(canvas, offsetX, offsetY, width, height,
					  0, 0, buffer.width, buffer.height);
	  // now call the callback with the dataURL of our buffer canvas
	  callback(buffer.toDataURL());
	},
	
	deployCroped: function(dataURL) {
	// TODO: Replace temporal code below to real results yelding to client component
			document.body.style.backgroundImage = 'url(' + dataURL + ')';
	},

	 items: [
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
					ID: "uploadForm", width: 80,
					fields: [
						{ name: "image", type: "imageFile", canEdit: true, showFileInline: true, downloadIconSrc: "new.png",
							changed: function(form, item){
								if (item.uploadItem._dataElement.files && item.uploadItem._dataElement.files[0]) {
									var reader = new FileReader();
										reader.onload = function(e) {
										//rCanv.setImage(e.target.result); 
										imgCanv.setSrc( e.target.result );
										imgCanv.currImg = new Image();
										imgCanv.currImg.src = e.target.result;
										
										// Drav selective rectangle
										isc.DrawRect.create({
											ID: "choiceArea",
											left: 0, top: 0,
											width: 150, height: 100,
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

									}
									
									reader.readAsDataURL(item.uploadItem._dataElement.files[0]);
								  }
							} 
						},
					]
				}),
				isc.Button.create({Id: "btnCrop", title:"Готово",
					click: function(){
						var topWind = this.topElement;
						//var box = choiceArea.getBoundingBox();
						//topWind.crop(imgCanv.currImg, box[0], box[1], box[2]-box[0], box[3]-box[1], topWind.deployCroped);
						topWind.crop(imgCanv.currImg, 
                      choiceArea.left, choiceArea.top, choiceArea.width, choiceArea.height, 
                      topWind.deployCroped);
					}
				})
			]})
	 ],

	draw: function () {
		this.setPosition();
		if (!this.readyToDraw()) return this;
		this.Super("draw", arguments);
	 }
	
});
 
