isc.BaseWindow.create({
  ID: "ImageProcessWindow", 
  title: "Image preprocessing window",

   items: [
		isc.DrawPane.create({
				ID: "drCanv",
				border: "1px solid blue",
				width: "100%", height: "99%",
				imageType: "normal",
				src: "tmp/CBM_Logo.png",
				children: [
					isc.Img.create({
									ID: "imgCanv",
									border: "1px solid green",
									width: "100%", height: "100%"        
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
										drCanv.setImage(e.target.result); 
										imgCanv.setSrc( e.target.result );
										imgCanv.setOpacity(50);
										
										// Drav selective rectangle
										isc.DrawRect.create({
											ID: "choiceArea",
											left: 400, top: 400,
											width: 150, height: 100,
											cssColor: "rgba(255, 255, 50, 0.75)",
											title: "Выделенная часть"
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
				isc.Button.create({Id: "btnCrop", title:"Готово"
					 })
			]})
   ],

  draw: function () {
    this.setPosition();
    if (!this.readyToDraw()) return this;
    this.Super("draw", arguments);
  }
  
});
 
